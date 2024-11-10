import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Grid, Card, CardContent, CardMedia, Button, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase-configs';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_live_51QHDIYAS1xt2wKUCi7Itw9sVj6QUMxZ49CjS0v0ehDCxkVaiUM3kRCNjaxEa6JFFZ9ABNbAL5PxNoD5fvzpjHBju004YXQ52E3');

const AppContainer = styled.div`
  text-align: center;
`;

const StyledTitle = styled(Typography)`
  flex-grow: 1;
  font-family: 'Sacramento', cursive;
  font-size: 2rem;
  color: white;
  text-align: left;
`;

const AppTitle = ({ children }) => {
  return (
    <StyledTitle variant="h6">
      {children}
    </StyledTitle>
  );
};

const AppHeader = styled.header`
  background-color: #282c34;
  padding: 16px 8px;
  color: white;
`;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        backgroundColor: '#f5f5f5',
        width: '300px',
        padding: '20px',
    },
}));

const ProductButton = styled(Button)`
  background-color: #282c34;
  color: white;
  &:hover {
    background-color: #333333;
  }
`;

// CartSummary Component
function CartSummary({ items, updateQuantity, removeItem }) {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    };

    const getTotalItems = () => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <Elements stripe={stripePromise}>
            <Button
                variant="contained"
                color="warning"
                startIcon={<ShoppingCartIcon />}
                onClick={toggleDrawer(true)}
            >
                Cart ({getTotalItems()})
            </Button>
            <StyledDrawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <List>
                    {items.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={item.name} secondary={`$${item.price} x ${item.quantity}`} />
                            <IconButton onClick={() => updateQuantity(item, item.quantity - 1)}>
                                <RemoveIcon />
                            </IconButton>
                            <IconButton onClick={() => updateQuantity(item, item.quantity + 1)}>
                                <AddIcon />
                            </IconButton>
                            <IconButton onClick={() => removeItem(item)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Subtotal" />
                        <Typography variant="h6">${calculateSubtotal()}</Typography>
                    </ListItem>
                    <CheckoutForm items={items} />
                </List>
            </StyledDrawer>
        </Elements>
    );
}

// Main Component
const App = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
  
    useEffect(() => {
      const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsArray = [];
        querySnapshot.forEach((doc) => {
          productsArray.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsArray);
      };
  
      fetchProducts();
    }, []);
  
    const addToCart = (product) => {
      const existingItem = cartItems.find(item => item.id === product.id);
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
    };

  const updateQuantity = (product, quantity) => {
    setCartItems(cartItems.map(item =>
      item.id === product.id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const removeItem = (product) => {
    setCartItems(cartItems.filter(item => item.id !== product.id));
  };

  return (
    <AppContainer>
      <AppHeader position="static">
        <Toolbar>
          <AppTitle variant="h6">
            Pretty Skin
          </AppTitle>
          <CartSummary items={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />
        </Toolbar>
      </AppHeader>
      <Container>
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  alt={product.name}
                  height="350"
                  image={product.src}
                  title={product.name}
                />
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    ${product.price}
                  </Typography>
                  <ProductButton variant="contained" style={{ marginTop: '10px' }} onClick={() => addToCart(product)}>
                    Add to Cart
                  </ProductButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </AppContainer>
  );
}

export default App;
