import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const Auth = ({ navigation }) => {
  const [toggle, setToggle] = useState(false); // false = login, true = signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [signingup, setsigning] = useState(false);
  const [logging, setlogging] = useState(false);

  const apiUrl = 'http://192.168.137.76:3000'; // Replace with actual

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setlogging(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || 'Invalid email or password.');
      } else {
        console.log('Login successful:', data);
        // Navigate or do what you want here
         navigation.navigate('Profile',{token : data.token});
      }
    } catch (err) {
      setError('Something went wrong. Please try again.',err);
    } finally {
      setlogging(false);
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    setsigning(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        setToggle(false);
      } else {
        setError(data.message || 'Signup failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.',err);
    } finally {
      setsigning(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>
            {toggle ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.subHeading}>
            {toggle ? 'Sign up to get started' : 'Sign in to continue'}
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.formContainer}>
          {toggle && (
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#8b8b8b"
              value={username}
              onChangeText={setUsername}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8b8b8b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8b8b8b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.authBtn}
            onPress={toggle ? handleSignup : handleLogin}
          >
            {toggle ? (
              signingup ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Create Account</Text>
              )
            ) : logging ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.toggleContainer}
          onPress={() => setToggle(!toggle)}
        >
          <Text style={styles.toggleText}>
            {toggle
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  heading: {
    color: '#2c3e50',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeading: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    color: '#2c3e50',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  authBtn: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  toggleText: {
    color: '#3498db',
    fontSize: 15,
    fontWeight: '500',
  },
  error: {
    color: '#e74c3c',
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: '#fde8e8',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
});

export default Auth;
