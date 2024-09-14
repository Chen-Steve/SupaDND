import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ItemModal from './item-modal';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

const INVENTORY_SIZE = 6;

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(Array(INVENTORY_SIZE).fill({ id: '', name: 'Empty', quantity: 0 }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        let fetchedItems: InventoryItem[];
        
        if (user) {
          // User is authenticated, fetch inventory from Supabase
          const { data, error } = await supabase
            .from('Inventory')
            .select('id, name, quantity')
            .eq('profileId', user.id)
            .limit(INVENTORY_SIZE);

          if (error) throw error;
          fetchedItems = data;
        } else {
          // User is not authenticated, get inventory from local storage
          const localInventory = localStorage.getItem('inventory');
          fetchedItems = localInventory ? JSON.parse(localInventory) : [];
        }

        // Pad the inventory to 6 slots if needed
        const paddedItems = [
          ...fetchedItems,
          ...Array(INVENTORY_SIZE - fetchedItems.length).fill({ id: '', name: 'Empty', quantity: 0 })
        ].slice(0, INVENTORY_SIZE);

        setItems(paddedItems);

        if (!user) {
          localStorage.setItem('inventory', JSON.stringify(paddedItems));
        }
      } catch (e) {
        setError('Failed to fetch inventory');
        console.error('Error fetching inventory:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setTimeout(() => setIsModalOpen(true), 50); // Slight delay for smoother transition
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300); // Delay to allow close animation
  };

  if (loading) return <div className="text-center">Loading inventory...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-100 p-3 rounded-lg shadow-md w-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-5 border-b border-gray-300 pb-2">Inventory</h2>
      <div className="grid grid-cols-6 gap-2 mt-2 mb-3">
        {items.map((item, index) => (
          <div 
            key={item.id || index} 
            className="aspect-square bg-white rounded shadow flex flex-col justify-center items-center p-1 text-center cursor-pointer hover:bg-gray-100"
            onClick={() => handleItemClick(item)}
          >
            <span className="text-[10px] font-medium truncate w-full">{item.name}</span>
            <span className="text-[10px] text-gray-600">{item.quantity}</span>
          </div>
        ))}
      </div>
      <ItemModal 
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}