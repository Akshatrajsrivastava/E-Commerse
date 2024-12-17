

// "use client";
// import React, { useState } from 'react';
// import { Menu, X } from 'lucide-react';

// // Define an interface for the Category
// interface Category {
//     _id: string;
//     name: string;
//     description?: string;
// }

// interface SidebarProps {
//     categories: Category[];
//     onCategorySelect: (category: Category) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//     categories,
//     onCategorySelect
// }) => {
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     // Sidebar content component to avoid duplication
//     const SidebarContent = () => {
//         // If no categories, show a placeholder
//         if (categories.length === 0) {
//             return (
//                 <>
//                     <h2 className="text-xl font-bold mb-4">Categories</h2>
//                     <div className="animate-pulse">
//                         <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                         <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                         <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                     </div>
//                 </>
//             );
//         }

//         return (
//             <>
//                 <h2 className="text-xl font-bold mb-4">Categories</h2>
//                 {categories.map((category) => (
//                     <div
//                         key={category._id}
//                         className="cursor-pointer p-2 hover:bg-gray-200 transition-colors duration-200"
//                         onClick={() => {
//                             onCategorySelect(category);
//                             setIsMobileMenuOpen(false);
//                         }}
//                     >
//                         {category.name}
//                     </div>
//                 ))}
//             </>
//         );
//     };

//     return (
//         <>
//             {/* Mobile Menu Toggle */}
//             <div className="lg:hidden fixed top-4 right-4 z-50">
//                 <button
//                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                     className="p-2 bg-gray-100 rounded-md shadow-md"
//                 >
//                     {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//                 </button>
//             </div>

//             {/* Desktop Sidebar */}
//             <div className="hidden lg:block w-64 p-4 bg-gray-100 h-full">
//                 <SidebarContent />
//             </div>

//             {/* Mobile Sidebar */}
//             <div className={`
//                 lg:hidden 
//                 fixed 
//                 inset-0 
//                 z-40 
//                 bg-white 
//                 transform 
//                 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
//                 transition-transform 
//                 duration-300 
//                 ease-in-out 
//                 w-64 
//                 p-4 
//                 bg-gray-100 
//                 h-full
//             `}>
//                 <SidebarContent />
//             </div>

//             {/* Overlay for mobile menu */}
//             {isMobileMenuOpen && (
//                 <div
//                     className="lg:hidden fixed inset-0 bg-black/50 z-30"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                 />
//             )}
//         </>
//     );
// };

// export default Sidebar;



"use client";

import React, { useState } from "react";
import { Menu, X, Layers } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

// Define an interface for the Category
interface Category {
    _id: string;
    name: string;
    description?: string;
}

interface SidebarProps {
    categories: Category[];
    onCategorySelect: (category: Category) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    categories,
    onCategorySelect
}) => {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        onCategorySelect(category);
    };

    // Render Categories Content
    const CategoryList = () => {
        if (categories.length === 0) {
            return (
                <div className="space-y-3 p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
            );
        }

        return (
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                {categories.map((category) => (
                    <Card
                        key={category._id}
                        className={`mb-2 cursor-pointer hover:shadow-lg transition-all duration-300 ${selectedCategory?._id === category._id
                            ? 'border-[#2f3b69] bg-[#fafaff]'
                            : 'border-gray-200'
                            }`}
                        onClick={() => handleCategorySelect(category)}
                    >
                        <CardContent className="p-4 flex items-center space-x-3">
                            <Layers
                                className="w-5 h-5"
                                color="#2f3b69"
                                strokeWidth={1.5}
                            />
                            <div>
                                <h3 className="font-semibold text-[#2f3b69]">
                                    {category.name}
                                </h3>
                                {/* {category.description && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {category.description}
                                    </p>
                                )} */}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </ScrollArea>
        );
    };

    return (
        <div>
            {/* Mobile Sidebar - Sheet Component */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="fixed top-4 right-4 z-50"
                        >
                            <Menu className="h-6 w-6" color="#2f3b69" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] bg-[#fafaff]">
                        <SheetHeader>
                            <SheetTitle
                                className="text-[#2f3b69] flex items-center space-x-2"
                            >
                                <Layers className="w-6 h-6" color="#2f3b69" />
                                <span>Categories</span>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                            <CategoryList />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div
                className="hidden lg:block left-0 top-0 bottom-0 w-64 p-4 bg-[#fafaff] 
                border-r border-gray-200 shadow-lg overflow-hidden"
            >
                <div className="flex items-center space-x-2 mb-6">
                    <Layers className="w-8 h-8" color="#2f3b69" />
                    <h1 className="text-2xl font-bold text-[#2f3b69]">
                        Categories
                    </h1>
                </div>
                <CategoryList />
            </div>
        </div>
    );
};

export default Sidebar;
