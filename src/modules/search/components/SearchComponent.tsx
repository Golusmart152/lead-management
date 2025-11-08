
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { search } from '../services/search-service';
import type { SearchResult } from '../types';
import { Search } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';

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
        <div className="relative w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search..."
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="pl-10"
                />
            </div>
            
            <AnimatePresence>
                {isFocused && query && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 z-50 mt-2"
                    >
                        <Card className="rounded-lg shadow-lg border">
                            <CardContent className="p-0">
                                {Object.keys(groupedResults).length > 0 ? (
                                    <div className="max-h-96 overflow-y-auto">
                                        {Object.entries(groupedResults).map(([module, items]) => (
                                            <React.Fragment key={module}>
                                                <div className="px-4 py-2 bg-muted/50 text-sm font-medium border-b">
                                                    {module}
                                                </div>
                                                {items.map(item => (
                                                    <button
                                                        key={item.id}
                                                        className="w-full text-left px-4 py-2 hover:bg-muted transition-colors duration-200 border-b last:border-b-0"
                                                        onClick={() => handleResultClick(item.url)}
                                                    >
                                                        <span className="font-medium">{item.title}</span>
                                                    </button>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-4 text-center text-muted-foreground">
                                        No results found
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchComponent;
