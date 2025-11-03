
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

interface License {
  id: string;
  tierId: string;
  status: string;
}

const MyLicensePage: React.FC = () => {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);

  useEffect(() => {
    if (user) {
      const fetchLicenses = async () => {
        const licensesCollection = collection(db, 'licenses');
        const q = query(licensesCollection, where("userId", "==", user.uid));
        const licenseSnapshot = await getDocs(q);
        const licenseList = licenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as License));
        setLicenses(licenseList);
      };

      fetchLicenses();
    }
  }, [user]);

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>My Licenses</Typography>
      <List>
        {licenses.length > 0 ? (
          licenses.map(license => (
            <ListItem key={license.id}>
              <ListItemText primary={`Tier: ${license.tierId}`} secondary={`Status: ${license.status}`} />
            </ListItem>
          ))
        ) : (
          <Typography>No licenses found.</Typography>
        )}
      </List>
    </Paper>
  );
};

export default MyLicensePage;
