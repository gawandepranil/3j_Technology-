import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W } = Dimensions.get('window');

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Missing Info', 'Please fill out all fields before sending.');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      Alert.alert('Message Sent!', 'We have received your message and will get back to you within 24 hours.');
    }, 1200);
  };

  const handleBookCall = () => {
    Alert.alert(
      'Book Strategy Call',
      'Choose a time slot for your 30-minute consultation call with our team. Do you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Schedule Now', 
          onPress: () => {
            Alert.alert('Success', 'Strategy call has been scheduled! A calendar invite has been sent to your email.');
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#030712', '#050c1a', '#070b13']} style={StyleSheet.absoluteFill} />

      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(client)/dashboard')} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact & Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.pageHero}>
          <Text style={styles.pageEyebrow}>GET IN TOUCH</Text>
          <Text style={styles.pageTitle}>Let's <Text style={styles.accentText}>Connect</Text></Text>
          <Text style={styles.pageSubtitle}>Ready to build something great? Book a free strategy call or send us a message.</Text>
        </View>

        <View style={styles.contactContent}>
          {/* Contact Info Cards */}
          <View style={styles.contactInfoRow}>
            {[
              { icon: 'mail-outline' as const, label: 'Email', value: 'hello@3jtech.io' },
              { icon: 'call-outline' as const, label: 'Phone', value: '+1 (555) 3J-TECH' },
              { icon: 'location-outline' as const, label: 'Location', value: 'Global · Remote' },
            ].map((info) => (
              <View key={info.label} style={styles.contactInfoCard}>
                <Ionicons name={info.icon} size={20} color="#eab308" />
                <Text style={styles.contactInfoLabel}>{info.label}</Text>
                <Text style={styles.contactInfoValue}>{info.value}</Text>
              </View>
            ))}
          </View>

          {/* Strategy Call Card */}
          <LinearGradient colors={['#1a0f00', '#0f172a']} style={styles.bookCallCard}>
            <Ionicons name="calendar-outline" size={32} color="#eab308" />
            <Text style={styles.bookCallCardTitle}>Book a Free Strategy Call</Text>
            <Text style={styles.bookCallCardText}>
              30 minutes with our technical lead. No commitment, just clarity on how we can help you build faster.
            </Text>
            <TouchableOpacity style={styles.bookCallCardBtn} onPress={handleBookCall} activeOpacity={0.85}>
              <LinearGradient colors={['#eab308', '#f97316']} style={styles.bookCallCardBtnGrad}>
                <Ionicons name="calendar" size={16} color="#030712" style={{ marginRight: 6 }} />
                <Text style={styles.bookCallCardBtnText}>Schedule a Call</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>

          {/* Form */}
          {submitted ? (
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              <Text style={styles.successTitle}>Message Sent!</Text>
              <Text style={styles.successText}>We'll get back to you within 24 hours.</Text>
              <TouchableOpacity onPress={() => setSubmitted(false)} style={styles.sendAnotherBtn}>
                <Text style={styles.sendAnotherText}>Send Another Message</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.contactForm}>
              <Text style={styles.contactFormTitle}>Send a Message</Text>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Your Name</Text>
                <View style={styles.formInputRow}>
                  <Ionicons name="person-outline" size={16} color="#6B7280" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. John Doe"
                    placeholderTextColor="#4B5563"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Email Address</Text>
                <View style={styles.formInputRow}>
                  <Ionicons name="mail-outline" size={16} color="#6B7280" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. john@company.com"
                    placeholderTextColor="#4B5563"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Project Description</Text>
                <View style={[styles.formInputRow, { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
                  <Ionicons name="document-text-outline" size={16} color="#6B7280" style={{ marginRight: 10, marginTop: 2 }} />
                  <TextInput
                    style={[styles.formInput, { height: '100%', textAlignVertical: 'top' }]}
                    placeholder="Tell us what you want to build..."
                    placeholderTextColor="#4B5563"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                  />
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleSubmit} 
                disabled={isSubmitting} 
                activeOpacity={0.85} 
                style={{ borderRadius: 12, overflow: 'hidden', marginTop: 8 }}
              >
                <LinearGradient colors={['#eab308', '#f97316']} style={styles.formSubmitBtn}>
                  <Text style={styles.formSubmitText}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Text>
                  <Ionicons name="send" size={16} color="#030712" style={{ marginLeft: 6 }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#030712' },
  scroll: { paddingBottom: 60 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#030712',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },

  pageHero: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 24,
  },
  pageEyebrow: { fontSize: 11, color: '#eab308', fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  pageTitle: { fontSize: isWeb ? 42 : 28, fontWeight: '800', color: '#f8fafc', marginBottom: 12, letterSpacing: -0.5 },
  accentText: { color: '#eab308' },
  pageSubtitle: { fontSize: isWeb ? 17 : 14, color: '#94a3b8', lineHeight: 26 },

  contactContent: { paddingHorizontal: 20, gap: 20 },
  contactInfoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  contactInfoCard: {
    flex: 1,
    minWidth: 90,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    gap: 6,
  },
  contactInfoLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  contactInfoValue: { fontSize: 12, color: '#f8fafc', fontWeight: '600', textAlign: 'center' },

  bookCallCard: {
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#2e1f05',
  },
  bookCallCardTitle: { fontSize: 20, fontWeight: '800', color: '#f8fafc', textAlign: 'center' },
  bookCallCardText: { fontSize: 14, color: '#94a3b8', lineHeight: 22, textAlign: 'center' },
  bookCallCardBtn: { borderRadius: 10, overflow: 'hidden', marginTop: 4 },
  bookCallCardBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bookCallCardBtnText: { color: '#030712', fontWeight: '700', fontSize: 14 },

  contactForm: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
    gap: 16,
  },
  contactFormTitle: { fontSize: 18, fontWeight: '700', color: '#f8fafc', marginBottom: 4 },
  formField: { gap: 6 },
  formLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  formInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#070b13',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  formInput: { flex: 1, fontSize: 14, color: '#f8fafc', height: '100%' },
  formSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  formSubmitText: { color: '#030712', fontWeight: '700', fontSize: 15 },

  successCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#10b98130',
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  successTitle: { fontSize: 20, fontWeight: '800', color: '#f8fafc' },
  successText: { fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 22 },
  sendAnotherBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    backgroundColor: '#070b13',
  },
  sendAnotherText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
});
