
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Typography, Paper, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

interface Tier {
  id: string;
  name: string;
  price: number;
}

const LicenseTiersPage: React.FC = () => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState('');

  const fetchTiers = async () => {
    const tiersCollection = collection(db, 'licenseTiers');
    const tierSnapshot = await getDocs(tiersCollection);
    const tierList = tierSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tier));
    setTiers(tierList);
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleAddTier = async () => {
    if (newTierName && newTierPrice) {
      try {
        await addDoc(collection(db, 'licenseTiers'), {
          name: newTierName,
          price: parseFloat(newTierPrice),
        });
        setNewTierName('');
        setNewTierPrice('');
        fetchTiers();
      } catch (error) {
        console.error("Error adding license tier: ", error);
      }
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>License Tiers</Typography>
      <List>
        {tiers.map(tier => (
          <ListItem key={tier.id}>
            <ListItemText primary={tier.name} secondary={`$${tier.price}`} />
          </ListItem>
        ))}
      </List>
      <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, mt: 2 }}>
        <TextField
          sx={{ ml: 1, flex: 1 }}
          placeholder="Tier Name"
          value={newTierName}
          onChange={(e) => setNewTierName(e.target.value)}
        />
        <TextField
          sx={{ ml: 1, flex: 1 }}
          placeholder="Price"
          type="number"
          value={newTierPrice}
          onChange={(e) => setNewTierPrice(e.target.value)}
        />
        <Button onClick={handleAddTier} variant="contained" sx={{ p: '10px' }}>Add Tier</Button>
      </Paper>
    </Paper>
  );
};

export default LicenseTiersPage;
