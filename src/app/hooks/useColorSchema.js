'use client';

export const useColors = () => {
  const colors = {
    primary: {
      main: '#CB342A',
      light: '#D65F57',
      dark: '#A32922',
    },
    secondary: {
      main: '#BCAE9F',
      light: '#CBBEB1',
      dark: '#9C8E80',
    },
    neutral: {
      text: '#191818',
      border: '#636060',
      background: '#FEFDFD',
    },
    accent: '#B3241A',
  };

  // Get CSS classes for common patterns
  const getClasses = (type, variant = 'main') => {
    const classes = {
      // Buttons
      button: {
        primary: 'bg-[#CB342A] text-white hover:bg-[#A32922] border-[#CB342A]',
        secondary: 'bg-[#BCAE9F] text-[#191818] hover:bg-[#9C8E80] border-[#BCAE9F]',
        outline: 'bg-transparent text-[#191818] border-[#636060] hover:bg-[#F7F7F7]',
      },
      // Backgrounds
      bg: {
        primary: 'bg-[#CB342A]',
        secondary: 'bg-[#BCAE9F]',
        neutral: 'bg-[#FEFDFD]',
        dark: 'bg-[#191818]',
      },
      // Text
      text: {
        primary: 'text-[#CB342A]',
        secondary: 'text-[#BCAE9F]',
        neutral: 'text-[#191818]',
        white: 'text-[#FEFDFD]',
      },
      // Borders
      border: {
        primary: 'border-[#CB342A]',
        secondary: 'border-[#BCAE9F]',
        neutral: 'border-[#636060]',
      }
    };

    return classes[type]?.[variant] || '';
  };

  // Get inline styles for dynamic values
  const getStyles = (type, variant = 'main') => {
    const styles = {
      primary: {
        main: { backgroundColor: '#CB342A', color: '#FEFDFD', borderColor: '#CB342A' },
        light: { backgroundColor: '#D65F57', color: '#191818', borderColor: '#D65F57' },
        dark: { backgroundColor: '#A32922', color: '#FEFDFD', borderColor: '#A32922' },
      },
      secondary: {
        main: { backgroundColor: '#BCAE9F', color: '#191818', borderColor: '#BCAE9F' },
        light: { backgroundColor: '#CBBEB1', color: '#191818', borderColor: '#CBBEB1' },
        dark: { backgroundColor: '#9C8E80', color: '#FEFDFD', borderColor: '#9C8E80' },
      },
      neutral: {
        background: { backgroundColor: '#FEFDFD' },
        text: { color: '#191818' },
        border: { borderColor: '#636060' },
      }
    };

    return styles[type]?.[variant] || {};
  };

  return {
    colors,
    getClasses,
    getStyles,
  };
};