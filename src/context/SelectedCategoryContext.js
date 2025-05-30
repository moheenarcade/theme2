// context/SelectedCategoryContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const SelectedCategoryContext = createContext();

export const SelectedCategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <SelectedCategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </SelectedCategoryContext.Provider>
  );
};

export const useSelectedCategory = () => useContext(SelectedCategoryContext);
