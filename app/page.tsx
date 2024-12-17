"use client"
import Head from 'next/head';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import OfferBanner from '../components/OfferBanner';
import DealsOfTheDay from '../components/DealsOfTheDay';
import React, { useState, useEffect } from 'react';
import CategoryProduct from '@/components/CategoryProduct';
import LoadingScreen from '@/components/ui/LoadingScreen';

const Page: React.FC = () => {
  const [category, setCategory] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onCategorySelect = (categoryValue: any) => {
    setCategory(categoryValue.name);
  }

  // If still loading, show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Pixorus</title>
      </Head>
      <Header />
      <div className="flex mt-1">
        <Sidebar
          categories={categories}
          onCategorySelect={onCategorySelect}
        />
        {category ? (
          <CategoryProduct category={category} />
        ) : (
          <OfferBanner />
        )}
      </div>
      <DealsOfTheDay />
    </div>
  );
};

export default Page;