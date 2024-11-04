import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// CartSummary Component
function CartSummary({ items }) {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    return (
        <div>
            <Button
                variant="contained"
                color="warning"
                startIcon={<ShoppingCartIcon />}
                onClick={toggleDrawer(true)}
            >
                
            </Button>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <List>
                    {items.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={item.name} secondary={`$${item.price}`} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </div>
    );
}

export default CartSummary;
