 'use client';

import React, { createContext, useContext, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';

// Simple accessible accordion implementation (replaces Radix-based component)
const AccordionItemContext = createContext(null);

const useAccordionItem = () => {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error('useAccordionItem must be used within AccordionItem');
  return ctx;
};

function Accordion({ children, className, ...props }) {
  return (
    <div data-slot="accordion" className={cn('space-y-0', className)} {...props}>
      {children}
    </div>
  );
}

function AccordionItem({ children, className, defaultOpen = false, id, ...props }) {
  const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));

  return (
    <AccordionItemContext.Provider value={{ isOpen, setIsOpen }}>
      <div data-slot="accordion-item" className={cn('border-b', className)} id={id} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

const AccordionTrigger = forwardRef(({ children, className, chevron = true, transition = { type: 'spring', stiffness: 150, damping: 22 }, ...props }, ref) => {
  const { isOpen, setIsOpen } = useAccordionItem();
  const localRef = useRef(null);
  useImperativeHandle(ref, () => localRef.current);

  return (
    <div data-slot="accordion-header" className="flex">
      <button
        ref={localRef}
        type="button"
        aria-expanded={isOpen}
        className={cn('flex flex-1 text-start items-center justify-between py-4 font-medium hover:underline', className)}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        {chevron && (
          <motion.span
            data-slot="accordion-trigger-chevron"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={transition}
            className="ml-2"
          >
            <ChevronDown className="size-5 shrink-0" />
          </motion.span>
        )}
      </button>
    </div>
  );
});

function AccordionContent({ children, className, transition = { type: 'spring', stiffness: 150, damping: 22 }, ...props }) {
  const { isOpen } = useAccordionItem();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-slot="accordion-content"
          key="accordion-content"
          initial={{ height: 0, opacity: 0, '--mask-stop': '0%' }}
          animate={{ height: 'auto', opacity: 1, '--mask-stop': '100%' }}
          exit={{ height: 0, opacity: 0, '--mask-stop': '0%' }}
          transition={transition}
          style={{
            maskImage: 'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
            WebkitMaskImage: 'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
            overflow: 'hidden',
          }}
          className={cn('overflow-hidden', className)}
          {...props}
        >
          <div className={cn('pb-4 pt-0 text-sm')}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, useAccordionItem };
