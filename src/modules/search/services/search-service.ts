
import { getCustomers } from '../../customers/services/customer-service';
import { getEmployees } from '../../employees/services/employee-service';
import { getLeads } from '../../leads/services/lead-service';
import { getProducts } from '../../products/services/product-service';
import type { SearchResult } from '../types';

export const search = async (query: string): Promise<SearchResult[]> => {
    const lowerCaseQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    if (!lowerCaseQuery) {
        return [];
    }

    // Search Customers
    const customers = await getCustomers();
    customers
        .filter(customer => customer.name.toLowerCase().includes(lowerCaseQuery))
        .forEach(customer => {
            results.push({
                id: customer.id,
                module: 'Customers',
                title: customer.name,
                url: `/customers/${customer.id}`,
            });
        });

    // Search Employees
    const employees = await getEmployees();
    employees
        .filter(employee => employee.name.toLowerCase().includes(lowerCaseQuery))
        .forEach(employee => {
            results.push({
                id: employee.id,
                module: 'Employees',
                title: employee.name,
                url: `/employees/${employee.id}`,
            });
        });

    // Search Leads
    const leads = await getLeads();
    leads
        .filter(lead => lead.company && lead.company.toLowerCase().includes(lowerCaseQuery))
        .forEach(lead => {
            results.push({
                id: lead.id,
                module: 'Leads',
                title: lead.company || '',
                url: `/leads/${lead.id}`,
            });
        });

    // Search Products
    const products = await getProducts();
    products
        .filter(product => product.name.toLowerCase().includes(lowerCaseQuery))
        .forEach(product => {
            results.push({
                id: product.id,
                module: 'Products',
                title: product.name,
                url: `/products/${product.id}`,
            });
        });

    return results;
};
