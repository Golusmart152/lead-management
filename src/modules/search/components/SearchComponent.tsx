
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    TextField, 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    Typography, 
    InputAdornment, 
    ListItemButton 
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { search } from '../services/search-service';
import type { SearchResult } from '../types';

const SearchComponent: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = useMemo(() => 
        debounce(async (searchQuery: string) => {
            if (searchQuery) {
                const searchResults = await search(searchQuery);
                setResults(searchResults);
            } else {
                setResults([]);
            }
        }, 300), 
    []);

    useEffect(() => {
        return () => {
            handleSearch.cancel();
        };
    }, [handleSearch]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setQuery(value);
        handleSearch(value);
    };

    const handleResultClick = (url: string) => {
        setQuery('');
        setResults([]);
        setIsFocused(false);
        navigate(url);
    };

    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.module]) {
            acc[result.module] = [];
        }
        acc[result.module].push(result);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <TextField
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click on results
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    sx: { borderRadius: 2 },
                }}
            />
            <AnimatePresence>
                {isFocused && query && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ 
                            position: 'absolute', 
                            top: '110%', 
                            left: 0, 
                            right: 0, 
                            zIndex: 10 
                        }}
                    >
                        <Paper elevation={4} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            {Object.keys(groupedResults).length > 0 ? (
                                <List>
                                    {Object.entries(groupedResults).map(([module, items]) => (
                                        <React.Fragment key={module}>
                                            <ListItem sx={{ bgcolor: 'grey[100]' }}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    {module}
                                                </Typography>
                                            </ListItem>
                                            {items.map(item => (
                                                <ListItemButton 
                                                    key={item.id} 
                                                    onClick={() => handleResultClick(item.url)}
                                                >
                                                    <ListItemText primary={item.title} />
                                                </ListItemButton>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                    <Typography>No results found</Typography>
                                </Box>
                            )}
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default SearchComponent;
