import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Profile = ({ route }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const backendUrl = "http://192.168.137.76:3000"; // replace with actual IP
  const token = route.params?.token;

  const profiledetails = () => {
    if (!token) {
      setError('No token provided');
      setLoading(false);
      return;
    }

    fetch(`${backendUrl}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(text); // This will log the server error page content
          });
        }
        return response.json(); // If response is OK, parse as JSON
      })
      .then(data => {
        setUserData(data);
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
        setError('Something went wrong');
      })
      .finally(() => setLoading(false)); // Stop loading once the fetch is complete
  };

  useEffect(() => {
    profiledetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <View style={styles.profileCard}>
            <Text style={styles.profileText}>Username: {userData.username}</Text>
            <Text style={styles.profileText}>Email: {userData.email}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    width: '100%',
    maxWidth: 400,
  },
  profileText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
});

export default Profile;
