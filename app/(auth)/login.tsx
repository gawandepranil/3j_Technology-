import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { authService } from '../../src/api/authService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Alert } from '../../src/utils/alert';


const { width: SW } = Dimensions.get('window');

type AuthMode = 'login' | 'signup';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 700, delay: 100,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 700, delay: 100,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const switchMode = (newMode: AuthMode) => {
    Animated.timing(formFade, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setMode(newMode);
      setEmail('');
      setPassword('');
      setFullName('');
      setConfirmPassword('');
      Animated.timing(formFade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    const result = await login(email.trim(), password);
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    
    try {
      setIsSigningUp(true);
      await authService.register({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: 'client', // Overridden by backend domain logic
      });
      
      // Auto-login after successful registration to open the dashboard immediately
      const loginResult = await login(email.trim(), password);
      setIsSigningUp(false);
      
      if (!loginResult.success) {
        // Fallback if auto-login fails
        Alert.alert(
          'Registration Successful',
          'Account created successfully. Please sign in with your credentials.',
          [
            {
              text: 'Sign In Now',
              onPress: () => switchMode('login')
            }
          ]
        );
      }
    } catch (error: any) {
      setIsSigningUp(false);
      const errorMsg = error?.response?.data?.detail || error?.message || 'Failed to create account. Please try again.';
      Alert.alert('Registration Failed', errorMsg);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Full dark background matching app theme */}
      <LinearGradient colors={['#030712', '#050c1a', '#070b13']} style={styles.bg}>

        {/* Subtle ambient glow */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── HEADER ── */}
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Back to landing */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/landing')} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoRow}>
              <LinearGradient
                colors={['#eab308', '#f97316']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.logoBox}
              >
                <Text style={styles.logoText}>3J</Text>
              </LinearGradient>
              <View>
                <Text style={styles.brandName}>3J Technologies</Text>
                <Text style={styles.brandSub}>AI · Cloud · IoT</Text>
              </View>
            </View>

            <View style={{ width: 40 }} />
          </Animated.View>

          {/* ── HERO TEXT ── */}
          <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.heroBadge}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#eab308" />
              <Text style={styles.heroBadgeText}>Secure Portal Access</Text>
            </View>
            <Text style={styles.heroTitle}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {mode === 'login'
                ? 'Sign in to access your 3J Technologies portal'
                : 'Join the 3J Technologies ecosystem'}
            </Text>
          </Animated.View>

          {/* ── MODE SWITCHER ── */}
          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}
              onPress={() => switchMode('login')}
              activeOpacity={0.8}
            >
              {mode === 'login' && (
                <LinearGradient
                  colors={['#eab308', '#f97316']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Ionicons name="log-in-outline" size={15} color={mode === 'login' ? '#030712' : '#9CA3AF'} />
              <Text style={[styles.modeTabText, mode === 'login' && styles.modeTabTextActive]}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, mode === 'signup' && styles.modeTabActive]}
              onPress={() => switchMode('signup')}
              activeOpacity={0.8}
            >
              {mode === 'signup' && (
                <LinearGradient
                  colors={['#eab308', '#f97316']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Ionicons name="person-add-outline" size={15} color={mode === 'signup' ? '#030712' : '#9CA3AF'} />
              <Text style={[styles.modeTabText, mode === 'signup' && styles.modeTabTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* ── FORM CARD ── */}
          <Animated.View style={[styles.formCard, { opacity: formFade }]}>

            {/* Unified Card Header */}
            <View style={styles.cardHeader}>
              <Ionicons name={mode === 'login' ? "key-outline" : "person-add-outline"} size={18} color="#eab308" />
              <View>
                <Text style={styles.cardHeaderTitle}>
                  {mode === 'login' ? 'Portal Sign In' : 'Create Account'}
                </Text>
                <Text style={styles.cardHeaderSub}>
                  {mode === 'login' ? 'Enter credentials to access your portal' : 'Fill in your details to register'}
                </Text>
              </View>
            </View>

            {/* ── FIELDS ── */}
            <View style={styles.formFields}>
              {/* Full Name (signup only) */}
              {mode === 'signup' && (
                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <View style={styles.fieldRow}>
                    <Ionicons name="person-outline" size={17} color="#6B7280" style={styles.fieldIcon} />
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="e.g. John Doe"
                      placeholderTextColor="#4B5563"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              {/* Email */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <View style={styles.fieldRow}>
                  <Ionicons name="mail-outline" size={17} color="#6B7280" style={styles.fieldIcon} />
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#4B5563"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {mode === 'signup' && email.trim().length > 0 && (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 4,
                    paddingHorizontal: 4,
                  }}>
                    {(() => {
                      const emailLower = email.trim().toLowerCase();
                      const isTeam = emailLower.endsWith('3j.com') || emailLower.endsWith('.3j.com') || emailLower.includes('.3j@') || emailLower === 'name3j@gmail.com';
                      if (isTeam) {
                        return (
                          <>
                            <Ionicons name="people" size={13} color="#eab308" />
                            <Text style={{ fontSize: 11, color: '#eab308', fontWeight: '600' }}>
                              Registering as a 3J Team Member (Internal dashboard)
                            </Text>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <Ionicons name="person" size={13} color="#9CA3AF" />
                            <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>
                              Registering as a Client (Client Portal)
                            </Text>
                          </>
                        );
                      }
                    })()}
                  </View>
                )}
              </View>

              {/* Password */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View style={styles.fieldRow}>
                  <Ionicons name="lock-closed-outline" size={17} color="#6B7280" style={styles.fieldIcon} />
                  <TextInput
                    style={[styles.fieldInput, { flex: 1 }]}
                    placeholder="Enter your password"
                    placeholderTextColor="#4B5563"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={17} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password (signup only) */}
              {mode === 'signup' && (
                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldLabel}>Confirm Password</Text>
                  <View style={styles.fieldRow}>
                    <Ionicons name="lock-closed-outline" size={17} color="#6B7280" style={styles.fieldIcon} />
                    <TextInput
                      style={[styles.fieldInput, { flex: 1 }]}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#4B5563"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                      <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={17} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Forgot password (login only) */}
              {mode === 'login' && (
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {/* Primary CTA */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={mode === 'login' ? handleLogin : handleSignUp}
                disabled={isLoading || isSigningUp}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#eab308', '#f97316']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.actionBtnGrad}
                >
                  {isLoading || isSigningUp ? (
                    <Text style={styles.actionBtnText}>Please wait...</Text>
                  ) : (
                    <>
                      <Text style={styles.actionBtnText}>
                        {mode === 'login' ? 'Sign In' : 'Sign Up'}
                      </Text>
                      <Ionicons
                        name={mode === 'login' ? 'log-in-outline' : 'checkmark-circle-outline'}
                        size={18}
                        color="#030712"
                      />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Switch mode */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <TouchableOpacity onPress={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
                <Text style={styles.switchLink}>
                  {mode === 'login' ? ' Sign Up' : ' Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Security note */}
          <View style={styles.securityNote}>
            <Ionicons name="lock-closed" size={12} color="#374151" />
            <Text style={styles.securityNoteText}>256-bit SSL encrypted · Your data is safe</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© {new Date().getFullYear()} 3J Technologies</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  glowTop: {
    position: 'absolute',
    top: -150,
    left: SW / 2 - 200,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#eab308',
    opacity: 0.05,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#f97316',
    opacity: 0.04,
  },

  container: { paddingHorizontal: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#1e293b',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 14, fontWeight: '900', color: '#030712' },
  brandName: { fontSize: 14, fontWeight: '700', color: '#f8fafc' },
  brandSub: { fontSize: 10, color: '#eab308', fontWeight: '600', letterSpacing: 0.5 },

  // Hero
  heroSection: { alignItems: 'center', marginBottom: 28 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#eab30810', borderWidth: 1, borderColor: '#eab30830',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, marginBottom: 14,
  },
  heroBadgeText: { fontSize: 11, color: '#eab308', fontWeight: '600', letterSpacing: 0.5 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#f8fafc', textAlign: 'center', marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20 },

  // Mode switcher
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#0b1221',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  modeTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 10, gap: 7, overflow: 'hidden',
  },
  modeTabActive: {},
  modeTabText: { fontSize: 14, fontWeight: '600', color: '#9CA3AF' },
  modeTabTextActive: { color: '#030712', fontWeight: '700' },

  // Form card
  formCard: {
    backgroundColor: '#0d1525',
    borderRadius: 20, borderWidth: 1, borderColor: '#1e293b',
    overflow: 'hidden', marginBottom: 20,
  },

  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 18, borderBottomWidth: 1, borderBottomColor: '#1e293b',
    backgroundColor: '#0f1e35',
  },
  cardHeaderTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  cardHeaderSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },

  // Role tabs
  roleTabsRow: {
    flexDirection: 'row', margin: 16, marginTop: 14,
    backgroundColor: '#070b13',
    borderRadius: 10, padding: 3, borderWidth: 1, borderColor: '#1e293b', gap: 3,
  },
  roleTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 8, gap: 6, overflow: 'hidden',
  },
  roleTabActive: {},
  roleTabText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  roleTabTextActive: { color: '#030712', fontWeight: '700' },

  // Form fields
  formFields: { padding: 16, gap: 14 },
  fieldWrap: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', marginLeft: 2 },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0b1424', borderWidth: 1, borderColor: '#2e3d5c',
    borderRadius: 12, paddingHorizontal: 14, height: 52,
  },
  fieldIcon: { marginRight: 10 },
  fieldInput: { flex: 1, fontSize: 14, color: '#f8fafc', height: '100%' },
  eyeBtn: { padding: 4, marginLeft: 6 },

  forgotBtn: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { fontSize: 13, color: '#eab308', fontWeight: '500' },

  // Action button
  actionBtn: {
    borderRadius: 12, overflow: 'hidden', marginTop: 4,
    shadowColor: '#eab308', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  actionBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 8,
  },
  actionBtnText: { fontSize: 16, fontWeight: '700', color: '#030712' },

  // Switch row
  switchRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 18, borderTopWidth: 1, borderTopColor: '#1e293b',
  },
  switchLabel: { fontSize: 13, color: '#6B7280' },
  switchLink: { fontSize: 13, color: '#eab308', fontWeight: '700' },

  // Security note
  securityNote: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16,
  },
  securityNoteText: { fontSize: 11, color: '#374151' },

  // Footer
  footer: { alignItems: 'center' },
  footerText: { fontSize: 11, color: '#1f2937' },
});
