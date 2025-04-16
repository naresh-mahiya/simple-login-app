import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

const Profile = ({ route, navigation }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const backendUrl = "http://192.168.137.76:3000"; // replace with actual IP
  const token = route.params?.token;

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            // Clear any stored tokens or user data here if needed
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: "destructive"
        }
      ]
    );
  };

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
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Profile</Text>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>{userData?.username}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{userData?.email}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
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
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#e74c3c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorContainer: {
    backgroundColor: '#fde8e8',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
});

export default Profile;
