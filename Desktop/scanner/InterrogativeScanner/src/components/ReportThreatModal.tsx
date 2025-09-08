/**
 * Report Threat Modal - Modal wrapper for threat reporting
 */

import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import ReportThreatScreen from '../screens/ReportThreatScreen';

interface ReportThreatModalProps {
  visible: boolean;
  onClose: () => void;
}

const ReportThreatModal: React.FC<ReportThreatModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>
        <ReportThreatScreen onClose={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  closeButton: {
    margin: 0,
  },
});

export default ReportThreatModal;
