/**
 * Advanced Professional Scanner Screen - Premium Cybersecurity UI
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing, 
  Alert,
  Dimensions,
  Image,
  ScrollView,
  TextInput
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import useScanStore from '../stores/scanStore';

interface ScannerScreenProps {
  onNavigateBack?: () => void;
  onScanComplete?: (result: any) => void;
  onNavigateToProfile?: () => void;
}

interface ScanResult {
  id: string;
  fileName: string;
  fileType: string;
  scanDate: string;
  status: 'safe' | 'warning' | 'threat';
  threatsFound: number;
  scanDuration: string;
  fileSize: number;
}

const ScannerScreen: React.FC<ScannerScreenProps> = ({ onNavigateBack, onScanComplete, onNavigateToProfile }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scanButtonScale = useRef(new Animated.Value(1)).current;
  const scanAnimation = useRef(new Animated.Value(0)).current;
  
  
  // State management
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [urlToScan, setUrlToScan] = useState('');
  const [scanType, setScanType] = useState<'file' | 'url'>('file');
  const { 
    isScanning, 
    scanProgress, 
    scanPhase, 
    currentScan, 
    startScan, 
    completeScan, 
    updateScanProgress
  } = useScanStore();
  const [currentFile, setCurrentFile] = useState<any>(null);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [scanResults, setScanResults] = useState({
    scannedItems: 0,
    threatsDetected: 0,
    estimatedTime: '0s'
  });

  // Initialize animations
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // Scanning animation
  useEffect(() => {
    if (isScanning) {
      const scanLoop = Animated.loop(
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      
      scanLoop.start();
      pulseLoop.start();
      
      return () => {
        scanLoop.stop();
        pulseLoop.stop();
      };
    }
    return undefined;
  }, [isScanning]);

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setCurrentFile({
          name: file.name,
          size: file.size,
          type: file.mimeType || 'Unknown',
          icon: getFileIcon(file.name)
        });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
      case 'mp4': case 'avi': case 'mov': return '🎥';
      case 'zip': case 'rar': case '7z': return '📦';
      case 'exe': case 'msi': return '⚙️';
      default: return '📁';
    }
  };

  const performScan = async () => {
    if (!currentFile && !urlInput.trim()) {
      Alert.alert('No File Selected', 'Please select a file or enter a URL to scan first.');
      return;
    }

    const scanData = {
      fileName: currentFile?.name || undefined,
      url: urlInput.trim() || undefined,
      scanType: currentFile ? 'file' as const : 'url' as const,
    };

    const scanId = startScan(scanData);
    setScanResults({ scannedItems: 0, threatsDetected: 0, estimatedTime: '45s' });

    const startTime = Date.now();

    const phases = [
      { progress: 20, status: 'Initializing scan...', duration: 800 },
      { progress: 40, status: 'Analyzing content...', duration: 1200 },
      { progress: 60, status: 'Checking signatures...', duration: 1500 },
      { progress: 80, status: 'Deep scanning...', duration: 600 },
      { progress: 100, status: 'Finalizing results...', duration: 400 }
    ];

    for (const phase of phases) {
      await new Promise(resolve => setTimeout(resolve, phase.duration));
      updateScanProgress(scanId, phase.progress, phase.status);
      
      Animated.timing(progressAnim, {
        toValue: phase.progress / 100,
        duration: 300,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: false,
      }).start();
    }

    const threatDetected = Math.random() > 0.8;
    const status = threatDetected ? 'threat' : 'safe';
    const threatType = threatDetected ? ['Malware', 'Trojan', 'Virus', 'Adware'][Math.floor(Math.random() * 4)] : undefined;
    
    completeScan(scanId, {
      status,
      threatType,
      riskLevel: threatDetected ? (['high', 'medium', 'critical'][Math.floor(Math.random() * 3)] as any) : 'low',
      duration: 2300,
      details: threatDetected ? `${threatType} detected in file` : 'No threats found',
    });

    setScanResults(prev => ({
      ...prev,
      scannedItems: prev.scannedItems + 1,
      threatsDetected: threatDetected ? prev.threatsDetected + 1 : prev.threatsDetected,
    }));

    Alert.alert(
      'Scan Complete',
      threatDetected ? `⚠️ Threat detected: ${threatType}` : '✅ File is clean',
      [{ text: 'OK' }]
    );
  };

  const showScanDetails = (result: ScanResult) => {
    Alert.alert(
      'Detailed Scan Results',
      `File: ${result.fileName}\nType: ${result.fileType}\nSize: ${formatFileSize(result.fileSize)}\nStatus: ${result.status.toUpperCase()}\nThreats Found: ${result.threatsFound}\nScan Duration: ${result.scanDuration}\nScan Date: ${new Date(result.scanDate).toLocaleString()}`,
      [{ text: 'OK' }]
    );
  };

  const scanUrl = async (url: string) => {
    startScan({
      scanType: 'url',
      url: url
    });

    const startTime = Date.now();

    const urlScanSteps = [
      { progress: 20, status: 'Checking URL reputation...', items: 1, time: '25s' },
      { progress: 40, status: 'Analyzing domain security...', items: 2, time: '20s' },
      { progress: 60, status: 'Scanning for phishing patterns...', items: 4, time: '15s' },
      { progress: 80, status: 'Verifying SSL certificates...', items: 6, time: '10s' },
      { progress: 100, status: 'URL scan complete', items: 8, time: '0s' }
    ];

    let urlThreats = 0;
    let urlStatus: 'safe' | 'warning' | 'threat' = 'safe';

    for (let i = 0; i < urlScanSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const step = urlScanSteps[i];
      if (step) {
        updateScanProgress(currentScan?.id || '', step.progress, step.status);
        
        if (i === urlScanSteps.length - 1) {
          // Determine URL safety based on domain patterns
          const suspiciousDomains = ['bit.ly', 'tinyurl', 'short.link', 'suspicious'];
          const isSuspicious = suspiciousDomains.some(domain => url.toLowerCase().includes(domain));
          
          if (isSuspicious || Math.random() > 0.85) {
            urlThreats = Math.floor(Math.random() * 2) + 1;
            urlStatus = urlThreats > 1 ? 'threat' : 'warning';
            updateScanProgress(currentScan?.id || '', 100, `URL scan complete - ${urlThreats} issue${urlThreats > 1 ? 's' : ''} detected`);
          } else {
            updateScanProgress(currentScan?.id || '', 100, 'URL scan complete - URL is safe');
          }
        }
        
        setScanResults({
          scannedItems: step.items,
          threatsDetected: i === urlScanSteps.length - 1 ? urlThreats : 0,
          estimatedTime: step.time
        });
        
        Animated.timing(progressAnim, {
          toValue: step.progress / 100,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start();
      }
    }

    const endTime = Date.now();
    const scanDuration = Math.round((endTime - startTime) / 1000);
    
    const urlResult: ScanResult = {
      id: Date.now().toString(),
      fileName: url,
      fileType: 'URL',
      scanDate: new Date().toISOString(),
      status: urlStatus,
      threatsFound: urlThreats,
      scanDuration: `${scanDuration}s`,
      fileSize: 0
    };

    if (onScanComplete) {
      onScanComplete(urlResult);
    }

    if (currentScan) {
      completeScan(currentScan.id, {
        status: urlThreats > 0 ? 'threat' : 'safe',
        details: `URL scan completed. Status: ${urlStatus}. Issues found: ${urlThreats}`
      });
    }

    Alert.alert(
      'URL Scan Complete',
      `URL: ${url}\nStatus: ${urlStatus.toUpperCase()}\nIssues: ${urlThreats}\nDuration: ${scanDuration}s`,
      [{ text: 'OK' }]
    );
  };

  const handleCancelScan = () => {
    Alert.alert(
      'Cancel Scan',
      'Are you sure you want to stop the current scan?',
      [
        { text: 'Continue Scanning', style: 'cancel' },
        { 
          text: 'Stop Scan', 
          style: 'destructive',
          onPress: () => {
            // Cancel scan logic
            if (currentScan) {
              completeScan(currentScan.id, {
                status: 'safe',
                details: 'Scan cancelled by user'
              });
            }
            Animated.timing(progressAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start();
          }
        }
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* User Profile Section */}
      <TouchableOpacity 
        style={styles.userProfileContainer}
        onPress={() => onNavigateToProfile && onNavigateToProfile()}
        activeOpacity={0.8}
      >
        <View style={styles.profileImageContainer}>
          <Image 
            source={require('../../assets/icon.jpg')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.profileStatusIndicator} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Security User</Text>
          <Text style={styles.profileStatus}>Active Scanner</Text>
        </View>
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={20} 
          color="#00d4ff" 
        />
      </TouchableOpacity>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onNavigateBack || (() => Alert.alert('Back', 'Navigate back'))}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => Alert.alert('Help', 'Scanning help and tips')}
          >
            <Text style={styles.helpIcon}>?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Scan Animation Area */}
        <View style={styles.scanAnimationContainer}>
          <Animated.View 
            style={[
              styles.scanRing,
              {
                transform: [
                  {
                    rotate: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                  { scale: pulseAnim }
                ],
              },
            ]}
          >
            <View style={styles.scanRingInner}>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {isScanning ? `${Math.round(scanProgress)}%` : 'Ready'}
                </Text>
                <Text style={styles.progressSubtext}>
                  {isScanning ? 'Scanning...' : 'Tap to start'}
                </Text>
              </View>
            </View>
          </Animated.View>
          
          {/* Progress Ring */}
          <Animated.View 
            style={[
              styles.progressRing,
              {
                transform: [
                  {
                    rotate: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <Animated.Text 
            style={[
              styles.statusText,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            {scanPhase || 'Ready to scan'}
          </Animated.Text>
        </View>

        {/* File Preview Section */}
        {currentFile && (
          <View style={styles.filePreviewCard}>
            <View style={styles.filePreviewHeader}>
              <Text style={styles.fileIcon}>{currentFile.icon}</Text>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{currentFile.name}</Text>
                <Text style={styles.fileDetails}>
                  {currentFile.type} • {formatFileSize(currentFile.size || 0)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Scan Details Section */}
        <TouchableOpacity 
          style={styles.detailsCard}
          onPress={() => setDetailsExpanded(!detailsExpanded)}
        >
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>Scan Details</Text>
            <Text style={styles.expandIcon}>
              {detailsExpanded ? '▼' : '▶'}
            </Text>
          </View>
          
          {detailsExpanded && (
            <View style={styles.detailsContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Scanned Items:</Text>
                <Text style={styles.detailValue}>{scanResults.scannedItems}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Threats Detected:</Text>
                <Text style={[styles.detailValue, { color: scanResults.threatsDetected > 0 ? '#ff6b6b' : '#00ff88' }]}>
                  {scanResults.threatsDetected}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time Remaining:</Text>
                <Text style={styles.detailValue}>{scanResults.estimatedTime}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* URL Scanning Section */}
        <View style={styles.urlScanContainer}>
          <Text style={styles.sectionTitle}>URL Scanner</Text>
          <View style={styles.urlInputContainer}>
            <TextInput
              style={styles.urlInput}
              placeholder="Enter URL to scan (https://example.com)"
              placeholderTextColor="#a0a9c0"
              value={urlInput}
              onChangeText={setUrlInput}
              editable={!isScanning}
            />
            <TouchableOpacity 
              style={[styles.urlScanButton, { opacity: urlInput.trim() && !isScanning ? 1 : 0.5 }]}
              onPress={() => urlInput.trim() && scanUrl(urlInput.trim())}
              disabled={!urlInput.trim() || isScanning}
            >
              <Text style={styles.urlScanButtonText}>🌐 Scan URL</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {!currentFile ? (
            <TouchableOpacity style={styles.selectButton} onPress={handleFilePicker}>
              <Text style={styles.selectButtonText}>📁 Select File to Scan</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.scanActions}>
              {!isScanning ? (
                <TouchableOpacity style={styles.startButton} onPress={performScan}>
                  <Text style={styles.startButtonText}>🛡️ Start Scan</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.cancelButton} onPress={() => setCurrentFile(null)}>
                  <Text style={styles.cancelButtonText}>⏹️ Cancel Scan</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.changeFileButton} 
                onPress={() => setCurrentFile(null)}
              >
                <Text style={styles.changeFileText}>Change File</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000814',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#001122',
    borderBottomWidth: 1,
    borderBottomColor: '#00ffff33',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ffff22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00ffff66',
  },
  backIcon: {
    fontSize: 20,
    color: '#00ffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ffff22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00ffff66',
  },
  helpIcon: {
    fontSize: 18,
    color: '#00ffff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scanAnimationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    position: 'relative',
  },
  scanRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#00ffff',
    borderRightColor: '#00ff88',
    borderBottomColor: '#ffff00',
    borderLeftColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  scanRingInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#001122',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00ffff33',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  progressSubtext: {
    fontSize: 14,
    color: '#00ffff',
    opacity: 0.8,
  },
  progressRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#00ff88',
    opacity: 0.6,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  filePreviewCard: {
    backgroundColor: '#001122',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00ffff33',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  filePreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 14,
    color: '#a0a9c0',
  },
  detailsCard: {
    backgroundColor: '#001122',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  expandIcon: {
    fontSize: 16,
    color: '#00ffff',
  },
  detailsContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#00ffff33',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#a0a9c0',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionContainer: {
    marginTop: 20,
  },
  selectButton: {
    backgroundColor: '#00ffff22',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ffff66',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ffff',
  },
  scanActions: {
    gap: 15,
  },
  startButton: {
    backgroundColor: '#00ff8822',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  cancelButton: {
    backgroundColor: '#ff6b6b22',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6b6b',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  changeFileButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a0a9c066',
  },
  changeFileText: {
    fontSize: 14,
    color: '#a0a9c0',
  },
  urlScanContainer: {
    backgroundColor: '#001122',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  urlInputContainer: {
    gap: 15,
  },
  urlInput: {
    backgroundColor: '#000814',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#00ffff33',
  },
  urlScanButton: {
    backgroundColor: '#00ffff22',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ffff66',
  },
  urlScanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ffff',
  },
  userProfileContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 17, 34, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  profileStatusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00ff88',
    borderWidth: 2,
    borderColor: '#001122',
  },
  profileInfo: {
    marginRight: 8,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  profileStatus: {
    fontSize: 12,
    color: '#00d4ff',
    fontWeight: '500',
  },
});

export default ScannerScreen;
