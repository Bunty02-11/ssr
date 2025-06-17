"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TabView = ({ tabs, activeTab, onTabChange, className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="flex flex-row items-center justify-center gap-2 mb-8 mq450:gap-1 mq450:mb-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300
              mq450:px-4 mq450:py-2 mq450:text-xs
              ${activeTab === tab.id 
                ? 'bg-black text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-black rounded-lg -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {tabs.find(tab => tab.id === activeTab)?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TabView; 