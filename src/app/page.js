'use client'

import { useState, useEffect } from "react"
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "AIzaSyAoVffxq5VLjcDzUMKfxJ4nPyZDNBQ-A7M",
  authDomain: "inventory-management-app-4646.firebaseapp.com",
  projectId: "inventory-management-app-4646",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [isDay, setIsDay] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const filteredInventory = inventory.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date().getHours()
      setIsDay(currentTime >= 6 && currentTime < 18)
    }, 1000 * 60 * 60) // update every hour
    return () => clearInterval(intervalId)
  }, [])

  const toggleDayNight = () => {
    setIsDay(!isDay)
  }

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
    setItemName('') // clear the item name state
    setOpen(false) // close the modal
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => {
    setOpen(true);
  }
const handleClose = () => { setOpen(false) }

return (
  <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
    sx={{
      backgroundColor: isDay ? '#87CEEB' : '#212121', // light blue for day, dark gray for night
      transition: 'background-color 1s ease-in-out',
    }}
  >
    <Box border={'1px solid #333'}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#3E8E41'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
  Inventory
</Typography>
        <TextField
          id="search-item"
          label="Search Item"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '50%',
            ml: 'auto',
          }}
        />
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={5}
          >
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body1">Quantity: {quantity}</Typography>
            <Button variant="outlined" color="error" onClick={() => removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add New Item
        </Typography>
        <TextField
          id="item-name"
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <Button variant="contained" color="success" onClick={() => addItem(itemName)}>
          Add Item
        </Button>
      </Box>
    </Modal>
    <Stack direction={'row'} spacing={2}>
      <Button variant="contained" color="success" onClick={handleOpen}>
        Add New Item
      </Button>
      <Button variant="contained" color={isDay ? 'error' : 'info'} onClick={toggleDayNight}>
        {isDay ? 'Switch to Night' : 'Switch to Day'}
      </Button>
    </Stack>
  </Box>
);
}

