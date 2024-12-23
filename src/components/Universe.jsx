import { useState, useEffect, useRef, useCallback, memo, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import SpiralGalaxy from './SpiralGalaxy';
import Planet from './Planet.jsx';
import UniverseSpheres from './UniverseSperese.jsx';
import DynamicStarfield from './DynamicStarfield.jsx';
import MapNavigation from './Minimap';
import CullingManager from './CullingManager';
import UniverseReveal from './UniverseReveal.jsx';
import AudioManager from './AudioManager';
import WalletSearch from './WalletSearch';
import  TransactionAnalytics from './TransactionAnalytics'
import WebGL from './WebGL'


// Constants
const WS_URL = 'ws://localhost:3000';
const MAX_PLANETS_PER_GALAXY = 40;
const TARGET_GALAXY_AMOUNT = 6000;
const MAX_GALAXY_AMOUNT = 7000;


const Universe = () => {

  // State Management
  const [galaxies, setGalaxies] = useState([]);
  const [solitaryPlanets, setSolitaryPlanets] = useState([]);
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userTransactions, setUserTransactions] = useState([]);
  const [isWalletView, setIsWalletView] = useState(false);
  const [walletSearchError, setWalletSearchError] = useState('');
  const [visibleObjects, setVisibleObjects] = useState(new Set());
  const [objectLODs, setObjectLODs] = useState(new Map());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [zoomPhase, setZoomPhase] = useState('none');
  const [universeRevealActive, setUniverseRevealActive] = useState(false);
  const [statusInfo, setStatusInfo] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Refs
  const mainCameraRef = useRef();
  const controlsRef = useRef();
  const wsRef = useRef(null);
  const lastGalaxyRef = useRef(null);
  const processedTransactions = useRef(new Set());
  const wheelSpeed = useRef(1);
  const allTransactionsRef = useRef(new Set());
  const galaxyPositionsRef = useRef(new Map());

 
// Galaxy Position Calculator
  const calculateGalaxyPosition = useCallback((index, total) => {
    if (galaxyPositionsRef.current.has(index)) {
      return galaxyPositionsRef.current.get(index);
    }

    // Calculate position with improved distribution
    const layerSize = Math.ceil(Math.sqrt(total));
    const layer = Math.floor(index / layerSize);
    const indexInLayer = index % layerSize;
    
    const minRadius = 200;
    const maxRadius = 800;
    const verticalSpread = 300;
    const spiralFactor = 6;
    
    const layerRadiusMultiplier = (layer + 1) / Math.ceil(total / layerSize);
    const baseRadius = minRadius + (maxRadius - minRadius) * layerRadiusMultiplier;
    
    const angleOffset = (layer * Math.PI * 0.5) + (Math.random() * Math.PI * 0.25);
    const layerHeight = (layer - Math.floor(total / layerSize) / 2) * (verticalSpread / 2);
    
    const angle = (indexInLayer / layerSize) * Math.PI * 2 * spiralFactor + angleOffset;
    const radiusJitter = (Math.random() - 0.5) * baseRadius * 0.3;
    const finalRadius = baseRadius + radiusJitter;
    
    const position = [
      Math.cos(angle) * finalRadius,
      layerHeight + (Math.random() - 0.5) * verticalSpread,
      Math.sin(angle) * finalRadius
    ];
    
    galaxyPositionsRef.current.set(index, position);
    return position;
  }, []);

  const handleGalaxyClick = useCallback((galaxy) => {
    if (!mainCameraRef.current || !controlsRef.current) {
      console.warn('Camera or controls not initialized');
      return;
    }
  
    setSelectedGalaxy(galaxy);
    //setStatusInfo(`Viewing Galaxy with ${galaxy.transactions.length} planets`);
    
    const camera = mainCameraRef.current;
    const controls = controlsRef.current;
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 2000;
    const startTime = Date.now();

    // Side view position (more to the side and slightly elevated)
    const finalPosition = new THREE.Vector3(50, 15, 0);
    const finalTarget = new THREE.Vector3(0, 0, 0);
    
    const zoomAnimation = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const eased = 1 - Math.pow(1 - progress, 4);
      
      // Calculate spiral path but maintaining side view approach
      const angle = progress * Math.PI * 1.5; // Reduced rotation for side approach
      const radius = startPosition.length() * (1 - eased) + 50 * eased;
      const spiralX = Math.cos(angle) * radius * (1 - eased) + finalPosition.x * eased;
      const spiralZ = Math.sin(angle) * radius * (1 - eased);
      const height = startPosition.y * (1 - eased) + finalPosition.y * eased;
      
      camera.position.set(
        spiralX,
        height,
        spiralZ
      );
      
      // Smoothly move target
      controls.target.lerpVectors(startTarget, finalTarget, eased);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(zoomAnimation);
      }
    };
    
    zoomAnimation();
  }, [galaxies, calculateGalaxyPosition]);

  const handleBackToUniverse = useCallback(() => {
    if (!mainCameraRef.current || !controlsRef.current) {
      console.warn('Camera or controls not initialized');
      return;
    }
  
    console.log('Back to Universe clicked');
    setStatusInfo('');
    
    const camera = mainCameraRef.current;
    const controls = controlsRef.current;
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 2000;
    const startTime = Date.now();

    // Final universe view position
    const finalPosition = new THREE.Vector3(0, 50, 100);
    const finalTarget = new THREE.Vector3(0, 0, 0);
    
    const zoomOutAnimation = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const eased = 1 - Math.pow(1 - progress, 4);
      
      // Calculate spiral path outward
      const angle = progress * Math.PI * 1.5; // Matching zoom-in rotation
      const radius = startPosition.length() * (1 - eased) + finalPosition.length() * eased;
      const spiralX = Math.cos(angle) * radius;
      const spiralZ = Math.sin(angle) * radius;
      const height = startPosition.y * (1 - eased) + finalPosition.y * eased;
      
      camera.position.set(
        spiralX,
        height,
        spiralZ
      );
      
      // Smoothly move target
      controls.target.lerpVectors(startTarget, finalTarget, eased);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(zoomOutAnimation);
      } else {
        // Only reset selection after animation completes
        setSelectedGalaxy(null);
        setSearchResult(null);
      }
    };
    
    zoomOutAnimation();
  }, [selectedGalaxy, galaxies, calculateGalaxyPosition]);

// Add useEffect to monitor state changes

useEffect(() => {
  console.log('Universe reveal active:', universeRevealActive);
}, [universeRevealActive]);// Add galaxies to dependencies

  const handleKeyDown = useCallback((e) => {
  if (!controlsRef.current || !mainCameraRef.current) return;
  
  const camera = mainCameraRef.current;
  const controls = controlsRef.current;
  const moveSpeed = 50;
  
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
      camera.position.z -= moveSpeed;
      controls.target.z -= moveSpeed;
      break;
    case 'ArrowDown':
    case 's':
      camera.position.z += moveSpeed;
      controls.target.z += moveSpeed;
      break;
    case 'ArrowLeft':
    case 'a':
      camera.position.x -= moveSpeed;
      controls.target.x -= moveSpeed;
      break;
    case 'ArrowRight':
    case 'd':
      camera.position.x += moveSpeed;
      controls.target.x += moveSpeed;
      break;
    case 'q':
      camera.position.y += moveSpeed;
      controls.target.y += moveSpeed;
      break;
    case 'e':
      camera.position.y -= moveSpeed;
      controls.target.y -= moveSpeed;
      break;
  }
  
  controls.update();
}, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!controlsRef.current || !mainCameraRef.current) return;
  
      const camera = mainCameraRef.current;
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
  
      // Normalize the wheel delta
      const delta = -Math.sign(e.deltaY);
      const speed = 15; // Adjust this value to change movement speed
  
      // Move camera forward/backward
      camera.position.addScaledVector(forward, delta * speed);
  
      // Update the orbital controls target
      controlsRef.current.target.addScaledVector(forward, delta * speed);
      controlsRef.current.update();
    };
  
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);


  useEffect(() => {
    let totalPlanets = 0;
    galaxies.forEach((galaxy, index) => {
      console.log(`Galaxy ${index} has ${galaxy.transactions.length} planets`);
      totalPlanets += galaxy.transactions.length;
    });
    console.log(`Total planets in galaxies: ${totalPlanets}`);
    console.log(`Solitary planets: ${solitaryPlanets.length}`);
  }, [galaxies, solitaryPlanets]);

  const groupTransactionsIntoGalaxies = useCallback((transactions) => {
    if (!transactions || transactions.length === 0) {
      return { galaxies: [], solitaryPlanets: [] };
    }

    const MAX_PLANETS_PER_GALAXY = 40; // Maximum planets per galaxy
    const TARGET_GALAXY_AMOUNT = 6000; // Keep transaction amount limit
    const MAX_GALAXY_AMOUNT = 7000; // Keep max amount limit

    // First deduplicate transactions based on hash
    const uniqueTransactions = Array.from(
      new Map(transactions.map(tx => [tx.hash, tx])).values()
    );
    
    const sortedTransactions = [...uniqueTransactions].sort((a, b) => b.amount - a.amount);
    const galaxies = [];
    let currentGalaxy = [];
    let currentSum = 0;
    
    // First separate out the large solo planets (> MAX_GALAXY_AMOUNT)
    const soloTransactions = sortedTransactions.filter(tx => tx.amount > MAX_GALAXY_AMOUNT);
    const galaxyTransactions = sortedTransactions.filter(tx => tx.amount <= MAX_GALAXY_AMOUNT);
    
    // Process remaining transactions into galaxies with both amount and count limits
    for (const tx of galaxyTransactions) {
      // Check both amount limit and planet count limit
      if (currentSum + tx.amount <= MAX_GALAXY_AMOUNT && currentGalaxy.length < MAX_PLANETS_PER_GALAXY) {
        currentGalaxy.push(tx);
        currentSum += tx.amount;
      } else {
        // Create new galaxy if either limit is reached
        if (currentGalaxy.length > 0) {
          galaxies.push({
            transactions: currentGalaxy,
            totalAmount: currentSum
          });
          console.log(`Created galaxy with ${currentGalaxy.length} planets and ${currentSum} total amount`);
        }
        currentGalaxy = [tx];
        currentSum = tx.amount;
      }
    }
    
    // Add the last galaxy if it has any transactions
    if (currentGalaxy.length > 0) {
      galaxies.push({
        transactions: currentGalaxy,
        totalAmount: currentSum
      });
      console.log(`Created final galaxy with ${currentGalaxy.length} planets and ${currentSum} total amount`);
    }

    console.log(`Total galaxies created: ${galaxies.length}`);
    console.log(`Solitary planets: ${soloTransactions.length}`);
    
    return { galaxies, solitaryPlanets: soloTransactions };
}, []);
 


  // Add smart galaxy management
  const handleNewTransaction = useCallback((newTransaction) => {
    // Add to processedTransactions if not already there
    if (!processedTransactions.current.has(newTransaction.hash)) {
      processedTransactions.current.add(newTransaction);
      
      // Add to allTransactionsRef if not already there
      if (!allTransactionsRef.current.has(newTransaction.hash)) {
        allTransactionsRef.current.add(newTransaction.hash);
        
        // Get all existing transactions plus the new one
        const existingTransactions = galaxies.flatMap(g => g.transactions);
        const allTransactions = [...existingTransactions, ...solitaryPlanets, newTransaction];
        
        // Regroup all transactions
        const { galaxies: newGalaxies, solitaryPlanets: newSolitaryPlanets } = 
          groupTransactionsIntoGalaxies(allTransactions);
        
        // Update state with all transactions
        setGalaxies(newGalaxies);
        setSolitaryPlanets(newSolitaryPlanets);
        
        console.log('Updated total transactions:', 
          newGalaxies.reduce((sum, g) => sum + g.transactions.length, 0) + 
          newSolitaryPlanets.length
        );
      }
    }
  }, [galaxies, solitaryPlanets, groupTransactionsIntoGalaxies]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
    };
  
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'initial') {
          // Ignore initial message if we already have transactions
          if (galaxies.length === 0 && solitaryPlanets.length === 0) {
            const transactions = message.data;
            transactions.forEach(tx => {
              if (!processedTransactions.current.has(tx.hash)) {
                processedTransactions.current.add(tx);
                allTransactionsRef.current.add(tx.hash);
              }
            });
            
            const { galaxies: newGalaxies, solitaryPlanets: newPlanets } = 
              groupTransactionsIntoGalaxies(transactions);
            
            setGalaxies(newGalaxies);
            setSolitaryPlanets(newPlanets);
          }
        } else if (message.type === 'update' && initialLoadComplete) {
          const tx = message.data;
          handleNewTransaction(tx);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
  
    wsRef.current = ws;
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [handleNewTransaction, initialLoadComplete, galaxies, solitaryPlanets]);

  useEffect(() => {
    const totalTransactions = galaxies.reduce((sum, g) => sum + g.transactions.length, 0) + 
      solitaryPlanets.length;
    console.log('Processed Transactions:', processedTransactions.current.size);
    console.log('Total Transactions in State:', totalTransactions);
  }, [galaxies, solitaryPlanets]);
  
  // Add smooth transition for new elements
  const getTransitionState = useCallback((transaction) => {
    const transitionStates = useRef(new Map());
    
    if (!transitionStates.current.has(transaction.hash)) {
      transitionStates.current.set(transaction.hash, {
        scale: 0,
        opacity: 0
      });
      
      // Animate in
      requestAnimationFrame(() => {
        transitionStates.current.set(transaction.hash, {
          scale: 1,
          opacity: 1
        });
      });
    }
    
    return transitionStates.current.get(transaction.hash);
  }, []);

  useEffect(() => {
    if (galaxies.length > 0) {
      lastGalaxyRef.current = galaxies.length - 1;
    }
  }, [galaxies]);

 
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    
    // Search in galaxies
    for (const galaxy of galaxies) {
      const foundTransaction = galaxy.transactions.find(tx => 
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (foundTransaction) {
        setSelectedGalaxy(galaxy);
        setSearchResult(foundTransaction.hash);
        // Center camera on found transaction
        if (mainCameraRef.current && controlsRef.current) {
          const duration = 1000;
          const startPosition = {
            x: mainCameraRef.current.position.x,
            y: mainCameraRef.current.position.y,
            z: mainCameraRef.current.position.z
          };
          const endPosition = {
            x: 0,
            y: 25,
            z: 30
          };
          
          const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            
            mainCameraRef.current.position.set(
              startPosition.x + (endPosition.x - startPosition.x) * eased,
              startPosition.y + (endPosition.y - startPosition.y) * eased,
              startPosition.z + (endPosition.z - startPosition.z) * eased
            );
            
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          const startTime = Date.now();
          animate();
        }
        return;
      }
    }
  
    // Search in solitary planets
    const foundPlanet = solitaryPlanets.find(tx => 
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    if (foundPlanet) {
      setSearchResult(foundPlanet.hash);
      setSelectedGalaxy(null);
      // Center and highlight solitary planet
      if (mainCameraRef.current && controlsRef.current) {
        const planetPosition = calculateGalaxyPosition(
          solitaryPlanets.indexOf(foundPlanet) + galaxies.length,
          solitaryPlanets.length + galaxies.length
        );
        
        const duration = 1000;
        const startPosition = {
          x: mainCameraRef.current.position.x,
          y: mainCameraRef.current.position.y,
          z: mainCameraRef.current.position.z
        };
        const endPosition = {
          x: planetPosition[0],
          y: planetPosition[1] + 10,
          z: planetPosition[2] + 20
        };
        
        const animate = () => {
          const now = Date.now();
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          
          mainCameraRef.current.position.set(
            startPosition.x + (endPosition.x - startPosition.x) * eased,
            startPosition.y + (endPosition.y - startPosition.y) * eased,
            startPosition.z + (endPosition.z - startPosition.z) * eased
          );
          
          controlsRef.current.target.set(planetPosition[0], planetPosition[1], planetPosition[2]);
          controlsRef.current.update();
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        const startTime = Date.now();
        animate();
      }
    } else {
      setSearchError('Transaction not found');
      setSearchResult(null);
    }
  };

  useEffect(() => {
    const fetchAndProcessTransactions = async () => {
      try {
        setLoading(true);
        let offset = 0;
        let allTransactions = [];
        let hasMore = true;
        let total = 0;
    
        // First get the total count
        const initialResponse = await fetch('http://localhost:3000/api/transactions?offset=0&limit=1');
        const initialData = await initialResponse.json();
        total = initialData.total;
        console.log(`Total transactions to load: ${total}`);
    
        // Then fetch all transactions in batches
        while (offset < total) {
          const response = await fetch(
            `http://localhost:3000/api/transactions?offset=${offset}&limit=1000`
          );
          const data = await response.json();
          
          if (!data.transactions || !Array.isArray(data.transactions)) {
            throw new Error("Received invalid data format");
          }
    
          allTransactions = [...allTransactions, ...data.transactions];
          
          // Log progress
          console.log(`Loaded ${allTransactions.length}/${total} transactions`);
          
          // Update state to show progress
          const { galaxies: galaxyGroups, solitaryPlanets: remainingPlanets } = 
            groupTransactionsIntoGalaxies(allTransactions);
          
          setGalaxies(galaxyGroups);
          setSolitaryPlanets(remainingPlanets);
          
          // Prepare for next batch
          offset += data.transactions.length;
          
          // Add small delay between batches
          await new Promise(resolve => setTimeout(resolve, 50));
        }
    
        // Process all transactions once loading is complete
        const { galaxies: finalGalaxies, solitaryPlanets: finalPlanets } = 
          groupTransactionsIntoGalaxies(allTransactions);
        
        setGalaxies(finalGalaxies);
        setSolitaryPlanets(finalPlanets);
        setLoading(false);
        setInitialLoadComplete(true);
        
        console.log(`Final load complete. Total transactions: ${allTransactions.length}`);
        
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchAndProcessTransactions();
  }, [groupTransactionsIntoGalaxies]);

  const galaxyPositions = galaxies.map((_, index) => 
    calculateGalaxyPosition(index, galaxies.length)
  );


  
  const handleWalletSearch = async (e) => {
    e.preventDefault();
    setWalletSearchError('');
    
    // Create a Set to store unique transaction hashes
    const seenHashes = new Set();
    
    // Get transactions from galaxies, ensuring uniqueness
    const buyTransactions = galaxies.flatMap(galaxy => 
      galaxy.transactions.filter(tx => {
        if (tx.toAddress.toLowerCase() === walletAddress.toLowerCase() && !seenHashes.has(tx.hash)) {
          seenHashes.add(tx.hash);
          return true;
        }
        return false;
      })
    );
  
    // Get transactions from solitary planets, ensuring uniqueness
    const solitaryBuyTransactions = solitaryPlanets.filter(tx =>
      tx.toAddress.toLowerCase() === walletAddress.toLowerCase() && !seenHashes.has(tx.hash)
    );
  
    // Combine unique transactions
    const transactions = [...buyTransactions, ...solitaryBuyTransactions];
    
    // Sort by amount (optional)
    transactions.sort((a, b) => b.amount - a.amount);
    
    setUserTransactions(transactions);
    setIsWalletView(true);
  
    if (transactions.length === 0) {
      setWalletSearchError('No transactions found for this wallet');
    }
  };
  
  const handleTransactionHighlight = (txHash) => {
    setSearchResult(txHash);
    
    const galaxyWithTx = galaxies.find(g => 
      g.transactions.some(tx => tx.hash === txHash)
    );
    
    if (galaxyWithTx) {
      setSelectedGalaxy(galaxyWithTx);
      setStatusInfo(`Selected Transaction: ${txHash.slice(0, 8)}... in Galaxy with ${galaxyWithTx.transactions.length} planets`);
    } else {
      const solitaryPlanet = solitaryPlanets.find(tx => tx.hash === txHash);
      if (solitaryPlanet) {
        setSelectedGalaxy(null);
        setStatusInfo(`Selected Solitary Planet - Amount: ${solitaryPlanet.amount.toFixed(2)}`);
        const planetPosition = calculateGalaxyPosition(
          solitaryPlanets.indexOf(solitaryPlanet) + galaxies.length,
          solitaryPlanets.length + galaxies.length
        );
        
        // Animate camera to focus on the solitary planet
        if (mainCameraRef.current && controlsRef.current) {
          const duration = 1500; // Increased duration for smoother animation
          const startPosition = {
            x: mainCameraRef.current.position.x,
            y: mainCameraRef.current.position.y,
            z: mainCameraRef.current.position.z
          };
          
          // Calculate a better viewing position
          const distance = 30; // Closer view of the planet
          const angle = Math.atan2(planetPosition[2], planetPosition[0]);
          const endPosition = {
            x: planetPosition[0] + Math.cos(angle) * distance,
            y: planetPosition[1] + 10, // Slight elevation
            z: planetPosition[2] + Math.sin(angle) * distance
          };
          
          const startTime = Date.now();
          const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // Cubic easing
            
            // Update camera position
            mainCameraRef.current.position.set(
              startPosition.x + (endPosition.x - startPosition.x) * eased,
              startPosition.y + (endPosition.y - startPosition.y) * eased,
              startPosition.z + (endPosition.z - startPosition.z) * eased
            );
            
            // Update controls target to center on planet
            controlsRef.current.target.set(
              planetPosition[0],
              planetPosition[1],
              planetPosition[2]
            );
            controlsRef.current.update();
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          animate();
        }
      }
    }
  };
  
    const clearWalletSearch = () => {
      setWalletAddress('');
      setUserTransactions([]);
      setIsWalletView(false);
      setWalletSearchError('');
      setSearchResult(null);
    };

    const handleSetVisible = useCallback((newVisible) => {
      setVisibleObjects(newVisible);
    }, []);

    useEffect(() => {
      const camera = mainCameraRef.current;
      const controls = controlsRef.current;
      if (camera && controls) {
        console.log('Camera and controls initialized');
      }
    }, [mainCameraRef, controlsRef]);
    
  
    
    useEffect(() => {
      if (selectedGalaxy) {
        console.log('Selected galaxy:', galaxies.indexOf(selectedGalaxy));
        console.log('Galaxy transactions:', selectedGalaxy.transactions.length);
      }
    }, [selectedGalaxy, galaxies]);
   

    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000000' }}>
       <AudioManager 
        isMapExpanded={isMapExpanded}
      />
  
        <WalletSearch 
      galaxies={galaxies}
      solitaryPlanets={solitaryPlanets}
      onTransactionSelect={(hash, galaxy) => {
        setSearchResult(hash);
        setSelectedGalaxy(galaxy);
      }}
      mainCameraRef={mainCameraRef}
      controlsRef={controlsRef}
      calculateGalaxyPosition={calculateGalaxyPosition}
    />
  
  <div style={{
          position: 'fixed',
          bottom: 0,
          left: 400,
          zIndex: 10
        }}>
          <TransactionAnalytics 
            galaxies={galaxies}
            solitaryPlanets={solitaryPlanets}
            onTransactionHighlight={handleTransactionHighlight}
          />
        </div>
  
        {/* Main Canvas */}
        <Canvas 
          camera={{ 
            position: [0, 50, 100], 
            fov: 65,
            far: 2000,
            near: 0.1,
            up: [0, 1, 0]
          }} 
          onCreated={({ gl, camera }) => {
            mainCameraRef.current = camera;
            
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.powerPreference = 'high-performance';
            gl.preserveDrawingBuffer = true;
          }}
          fallback={
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              background: 'rgba(0,0,0,0.8)',
              padding: '20px',
              borderRadius: '10px'
            }}>
              Loading 3D Scene...
            </div>
          }
        >
          <Suspense fallback={null}>
            <WebGL/>
  
            {universeRevealActive && (
              <UniverseReveal active={true} />
            )}
  
            {!universeRevealActive && (
              <>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <UniverseSpheres 
                  selectedGalaxy={selectedGalaxy}
                  zoomPhase={zoomPhase}
                />
                <DynamicStarfield />
                
                <CullingManager
                  galaxies={galaxies}
                  solitaryPlanets={solitaryPlanets}
                  selectedGalaxy={selectedGalaxy}
                  searchResult={searchResult}
                  calculateGalaxyPosition={calculateGalaxyPosition}
                  onSetVisible={handleSetVisible}
                />
  
                {selectedGalaxy ? (
                  <SpiralGalaxy 
                    transactions={selectedGalaxy.transactions}
                    position={[0, 0, 0]}
                    isSelected={true}
                    colorIndex={galaxies.findIndex(g => g === selectedGalaxy)}
                    highlightedHash={searchResult}
                    lodLevel={objectLODs.get(`galaxy-${galaxies.findIndex(g => g === selectedGalaxy)}`) || 'HIGH'}
                  />
                ) : (
                  <>
                    {galaxies.map((galaxy, index) => (
                      visibleObjects.has(`galaxy-${index}`) && (
                        <SpiralGalaxy
                          key={index}
                          transactions={galaxy.transactions}
                          position={calculateGalaxyPosition(index, galaxies.length)}
                          onClick={() => handleGalaxyClick(galaxy)}
                          isSelected={false}
                          colorIndex={index}
                          lodLevel={objectLODs.get(`galaxy-${index}`) || 'HIGH'}
                        />
                      )
                    ))}
  
                    {solitaryPlanets.map((tx, index) => (
                      visibleObjects.has(`planet-${index}`) && (
                        <Planet
                          key={tx.hash}
                          transaction={tx}
                          position={calculateGalaxyPosition(
                            index + galaxies.length,
                            solitaryPlanets.length + galaxies.length
                          )}
                          baseSize={2}
                          colorIndex={index}
                          isHighlighted={tx.hash === searchResult}
                          lodLevel={objectLODs.get(`planet-${index}`) || 'HIGH'}
                        />
                      )
                    ))}
                  </>
                )}
                
                <OrbitControls 
                  ref={controlsRef}
                  enableZoom={true}
                  maxDistance={selectedGalaxy ? 40 : 1000}
                  minDistance={5}
                  autoRotate={!selectedGalaxy}
                  autoRotateSpeed={0.3}
                  maxPolarAngle={Math.PI}
                  minPolarAngle={0}
                  zoomSpeed={1}
                  rotateSpeed={0.5}
                  panSpeed={5}
                  enableDamping={true}
                  dampingFactor={0.1}
                  mouseButtons={{
                    LEFT: THREE.MOUSE.ROTATE,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.PAN
                  }}
                  screenSpacePanning={true}
                  enablePan={true}
                  keyPanSpeed={25}
                />
              </>
            )}
          </Suspense>
        </Canvas>
  
        {/* Status Info */}
        <div style={{ 
          position: 'absolute', 
          bottom: '5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '1.1rem',
          maxWidth: '80%',
          textAlign: 'center',
          opacity: statusInfo ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}>
          {statusInfo}
        </div>
  
        {/* Minimap */}
        {!selectedGalaxy && (
  <MapNavigation 
    mainCamera={mainCameraRef.current}
    controlsRef={controlsRef}
    galaxyPositions={galaxyPositions}
    onNavigate={() => {}}
    selectedGalaxy={null}
    onExpandChange={setIsMapExpanded} 
  />
)}
  
        {/* Stats */}
        {/* <div style={{ 
          position: 'absolute', 
          bottom: '1rem', 
          left: '1rem', 
          zIndex: 10, 
          display: 'flex', 
          gap: '1rem',
          color: 'white',
          background: 'rgba(0,0,0,0.5)',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontFamily: 'monospace'
        }}>
          <div>Galaxies: {galaxies.length}</div>
          <div>|</div>
          <div>Solitary Planets: {solitaryPlanets.length}</div>
          <div>|</div>
          <div>Total Transactions: {
            galaxies.reduce((sum, g) => sum + g.transactions.length, 0) + 
            solitaryPlanets.length
          }</div>
        </div> */}
  
        {/* Back to Universe Button */}
        {selectedGalaxy && (
         <button
        style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      padding: '10px',
      background: 'rgba(0, 0, 0, 0.3)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',  // Changed to make it perfectly circular
      cursor: 'pointer',
      backdropFilter: 'blur(4px)',
      transition: 'all 0.4s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',  // Added to center the icon
      gap: '8px',
      fontSize: '14px',
      height: '55px',
      width: '55px',  // Changed minWidth to width for exact sizing
      outline: 'none',  // Added to remove focus outline
      zIndex: 1000,   // Match other button widths
        }}
       onMouseEnter={(e) => {
      e.target.style.border = '1px solid rgba(0, 157, 255, 0.8)';  // Added blue border
      e.target.style.boxShadow = '0 0 10px rgba(0, 157, 255, 0.3)';  // Added subtle blue glow
    }}
    onMouseLeave={(e) => {
      e.target.style.background = 'rgba(0, 0, 0, 0.3)';
      e.target.style.transform = 'scale(1)';
      e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';  // Reset border
      e.target.style.boxShadow = 'none';  // Remove glow
    }}
    onClick={handleBackToUniverse}
    aria-label="Back to Universe"
  >
    <i 
      className="ri-arrow-left-line" 
      style={{ 
        fontSize: '1.2em',
        pointerEvents: 'none',
        transition: 'color 0.4s ease-in-out' // Added to prevent icon from interfering with hover
      }} 
    />
  </button>
      )}
      {loading && (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    background: 'rgba(0,0,0,0.8)',
    padding: '20px',
    borderRadius: '10px',
    zIndex: 1000
  }}>
    Loading Transactions: {
      galaxies.reduce((sum, g) => sum + g.transactions.length, 0) + 
      solitaryPlanets.length
    }
  </div>
  
)}
    </div>
  );
};

export default Universe;