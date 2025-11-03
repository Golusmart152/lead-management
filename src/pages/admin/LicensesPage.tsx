
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Typography, Paper, TextField, Button, List, ListItem, ListItemText, Autocomplete } from '@mui/material';

interface License {
  id: string;
  userId: string;
  tierId: string;
  status: string;
}

interface User {
  id: string;
  email: string;
}

interface Tier {
  id: string;
  name: string;
}

const LicensesPage: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  const fetchLicenses = async () => {
    const licensesCollection = collection(db, 'licenses');
    const licenseSnapshot = await getDocs(licensesCollection);
    const licenseList = licenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as License));
    setLicenses(licenseList);
  };

  const fetchUsersAndTiers = async () => {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, email: doc.data().email } as User));
    setUsers(userList);

    const tiersCollection = collection(db, 'licenseTiers');
    const tierSnapshot = await getDocs(tiersCollection);
    const tierList = tierSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name } as Tier));
    setTiers(tierList);
  };

  useEffect(() => {
    fetchLicenses();
    fetchUsersAndTiers();
  }, []);

  const handleAddLicense = async () => {
    if (selectedUser && selectedTier) {
      try {
        await addDoc(collection(db, 'licenses'), {
          userId: selectedUser.id,
          tierId: selectedTier.id,
          status: 'active',
        });
        setSelectedUser(null);
        setSelectedTier(null);
        fetchLicenses();
      } catch (error) {
        console.error("Error adding license: ", error);
      }
    }
  };

  return (
    <Paper sx={{ p: 4, mt: 2 }}>
      <Typography variant="h5" gutterBottom>Licenses</Typography>
      <List>
        {licenses.map(license => (
          <ListItem key={license.id}>
            <ListItemText primary={`User: ${license.userId}`} secondary={`Tier: ${license.tierId} - Status: ${license.status}`} />
          </ListItem>
        ))}
      </List>
      <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600, mt: 2 }}>
        <Autocomplete
          options={users}
          getOptionLabel={(option) => option.email}
          style={{ width: 300 }}
          value={selectedUser}
          onChange={(_, newValue) => {
            setSelectedUser(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="User" variant="outlined" />}
        />
        <Autocomplete
          options={tiers}
          getOptionLabel={(option) => option.name}
          style={{ width: 200, marginLeft: 8 }}
          value={selectedTier}
          onChange={(_, newValue) => {
            setSelectedTier(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Tier" variant="outlined" />}
        />
        <Button onClick={handleAddLicense} variant="contained" sx={{ p: '10px', ml: 1 }}>Add License</Button>
      </Paper>
    </Paper>
  );
};

export default LicensesPage;
