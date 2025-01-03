import React, { useState } from 'react';

const WalletSearch = ({ 
  galaxies, 
  solitaryPlanets, 
  onTransactionSelect, 
  mainCameraRef, 
  controlsRef,
  calculateGalaxyPosition 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userTransactions, setUserTransactions] = useState([]);
  const [isWalletView, setIsWalletView] = useState(false);
  const [walletSearchError, setWalletSearchError] = useState('');

  const handleWalletSearch = (address) => {
    console.log('Searching for address:', address); // Debug log
    console.log('Number of galaxies:', galaxies.length); // Debug log
    
    setWalletSearchError('');
    if (!address || !address.trim()) return;

    const seenHashes = new Set();
    const buyTransactions = [];

    // Search in galaxies
    for (const galaxy of galaxies) {
      if (!galaxy.transactions) continue;
      
      for (const tx of galaxy.transactions) {
        if (tx.toAddress && 
            tx.toAddress.toLowerCase() === address.toLowerCase() && 
            !seenHashes.has(tx.hash)) {
          seenHashes.add(tx.hash);
          buyTransactions.push(tx);
        }
      }
    }

    // Search in solitary planets
    const solitaryBuyTransactions = solitaryPlanets.filter(tx =>
      tx.toAddress && 
      tx.toAddress.toLowerCase() === address.toLowerCase() && 
      !seenHashes.has(tx.hash)
    );

    const transactions = [...buyTransactions, ...solitaryBuyTransactions];
    
    console.log('Found transactions:', transactions.length); // Debug log
    
    if (transactions.length > 0) {
      transactions.sort((a, b) => b.amount - a.amount);
      setUserTransactions(transactions);
      setIsWalletView(true);
    } else {
      setWalletSearchError('No transactions found for this wallet');
      setUserTransactions([]);
      setIsWalletView(false);
    }
  };

  const handleKeyDown = async (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      try {
        const clipText = await navigator.clipboard.readText();
        setWalletAddress(clipText);
        handleWalletSearch(clipText);
      } catch (err) {
        console.error('Failed to read clipboard:', err);
      }
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    setWalletAddress(pastedText);
    setTimeout(() => handleWalletSearch(pastedText), 0);
  };

  const handleTransactionHighlight = (txHash) => {
    const galaxyWithTx = galaxies.find(g => 
      g.transactions.some(tx => tx.hash === txHash)
    );
    
    if (galaxyWithTx) {
      onTransactionSelect(txHash, galaxyWithTx);
    } else {
      const solitaryPlanet = solitaryPlanets.find(tx => tx.hash === txHash);
      
      if (solitaryPlanet) {
        onTransactionSelect(txHash, null);
        const planetPosition = calculateGalaxyPosition(
          solitaryPlanets.indexOf(solitaryPlanet) + galaxies.length,
          solitaryPlanets.length + galaxies.length
        );
        
        if (mainCameraRef.current && controlsRef.current) {
          const duration = 1500;
          const startPosition = {
            x: mainCameraRef.current.position.x,
            y: mainCameraRef.current.position.y,
            z: mainCameraRef.current.position.z
          };
          
          const distance = 30;
          const angle = Math.atan2(planetPosition[2], planetPosition[0]);
          const endPosition = {
            x: planetPosition[0] + Math.cos(angle) * distance,
            y: planetPosition[1] + 10,
            z: planetPosition[2] + Math.sin(angle) * distance
          };
          
          const startTime = Date.now();
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
    onTransactionSelect(null, null);
    setIsExpanded(false);
    setIsHovered(false);
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'inline-flex',
        alignItems: 'center',
        color: '#fff',
        padding: '10px',
        borderRadius: isExpanded ? '12px' : '50px',
        border: `1px solid ${isHovered ? '#24D2FB' : 'rgba(255, 255, 255, 0.2)'}`,
        transition: 'all 0.4s ease-in-out',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
        minWidth: isExpanded ? '400px' : '55px',
        height: isExpanded ? 'auto' : '55px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            display: 'grid',
            placeItems: 'center',
            width: '35px',
            height: '35px',
            cursor: 'pointer',
            background: 'transparent',
            color: isHovered ? '#24D2FB' : 'white',
            border: 'none',
            outline: 'none',
            transition: 'all 0.4s ease-in-out',
          }}
        >
          <i className="ri-wallet-line" style={{ fontSize: '1.2em' }} />
        </button>
      )}

      {isExpanded && (
        <div style={{
          width: '100%',
          opacity: 1,
          visibility: 'visible',
          transition: 'all 0.4s ease-in-out',
          transform: 'scale(1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px'
          }}>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Enter wallet address..."
              style={{
                padding: '10px 15px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                width: '340px',
                backdropFilter: 'blur(10px)',
                fontSize: '14px',
                transition: 'all 0.3s ease',
              }}
            />
            <button
              onClick={clearWalletSearch}
              style={{
                display: 'grid',
                placeItems: 'center',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                background: 'rgba(255, 77, 77, 0.1)',
                color: '#ff4d4d',
                border: '1px solid rgba(255, 77, 77, 0.3)',
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <i className="ri-close-line" style={{ fontSize: '1.2em' }} />
            </button>
          </div>

          {walletSearchError && (
            <div style={{
              color: '#ff6b6b',
              background: 'rgba(255, 77, 77, 0.1)',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '13px',
              border: '1px solid rgba(255, 77, 77, 0.2)'
            }}>
              {walletSearchError}
            </div>
          )}

          {isWalletView && userTransactions.length > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '15px',
              borderRadius: '8px',
              width: '100%',
              maxHeight: '300px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              fontSize: '13px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                color: 'white',
                padding: '0 6px',
                fontSize: '12px'
              }}>
                <span>Wallet: {walletAddress.slice(0, 8)}...</span>
                <span>{userTransactions.length} transactions</span>
              </div>
              
              <div style={{
                overflowY: 'auto',
                maxHeight: '250px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(36, 210, 251, 0.3) transparent',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '6px'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  color: 'white',
                }}>
                  <thead style={{
                    position: 'sticky',
                    top: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 1,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <tr>
                      <th style={{padding: '8px 12px', textAlign: 'left'}}>Transaction ID</th>
                      <th style={{padding: '8px 12px', textAlign: 'right'}}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTransactions.map(tx => (
                      <tr 
                        key={tx.hash} 
                        style={{
                          borderTop: '1px solid rgba(255,255,255,0.05)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleTransactionHighlight(tx.hash)}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(36, 210, 251, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{padding: '8px 12px'}}>{tx.hash.slice(0,10)}...</td>
                        <td style={{padding: '8px 12px', textAlign: 'right'}}>{tx.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletSearch;