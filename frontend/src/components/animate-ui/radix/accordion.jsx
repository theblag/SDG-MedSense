'use client';;
import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { cn } from '@/lib/utils';

const AccordionItemContext = React.createContext(undefined);

const useAccordionItem = () => {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error('useAccordionItem must be used within an AccordionItem');
  }
  return context;
};

function Accordion(props) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  children,
  ...props
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <AccordionItemContext.Provider value={{ isOpen, setIsOpen }}>
      <AccordionPrimitive.Item
        data-slot="accordion-item"
        className={cn('border-b', className)}
        {...props}>
        {children}
      </AccordionPrimitive.Item>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({
  ref,
  className,
  children,
  transition = { type: 'spring', stiffness: 150, damping: 22 },
  chevron = true,
  ...props
}) {
  const triggerRef = React.useRef(null);
  React.useImperativeHandle(ref, () => triggerRef.current);
  const { isOpen, setIsOpen } = useAccordionItem();

  React.useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          const currentState = node.getAttribute('data-state');
          setIsOpen(currentState === 'open');
        }
      });
    });
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['data-state'],
    });
    const initialState = node.getAttribute('data-state');
    setIsOpen(initialState === 'open');
    return () => {
      observer.disconnect();
    };
  }, [setIsOpen]);

  return (
    <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
      <AccordionPrimitive.Trigger
        ref={triggerRef}
        data-slot="accordion-trigger"
        className={cn(
          'flex flex-1 text-start items-center justify-between py-4 font-medium hover:underline',
          className
        )}
        {...props}>
        {children}

        {chevron && (
          <motion.div
            data-slot="accordion-trigger-chevron"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={transition}>
            <ChevronDown className="size-5 shrink-0" />
          </motion.div>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  transition = { type: 'spring', stiffness: 150, damping: 22 },
  ...props
}) {
  const { isOpen } = useAccordionItem();

  return (
    <AnimatePresence>
      {isOpen && (
        <AccordionPrimitive.Content forceMount {...props}>
          <motion.div
            key="accordion-content"
            data-slot="accordion-content"
            initial={{ height: 0, opacity: 0, '--mask-stop': '0%' }}
            animate={{ height: 'auto', opacity: 1, '--mask-stop': '100%' }}
            exit={{ height: 0, opacity: 0, '--mask-stop': '0%' }}
            transition={transition}
            style={{
              maskImage:
                'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
              WebkitMaskImage:
                'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
            }}
            className="overflow-hidden"
            {...props}>
            <div className={cn('pb-4 pt-0 text-sm', className)}>{children}</div>
          </motion.div>
        </AccordionPrimitive.Content>
      )}
    </AnimatePresence>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, useAccordionItem };
