'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type StaggerProps = React.ComponentPropsWithoutRef<typeof motion.div> & {
  delayChildren?: number
  staggerChildren?: number
}

const containerVariants = (delayChildren: number, staggerChildren: number) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren,
      staggerChildren
    }
  }
})

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 }
}

export function Stagger({ children, className, delayChildren = 0.15, staggerChildren = 0.12, ...props }: StaggerProps) {
  return (
    <motion.div
      variants={containerVariants(delayChildren, staggerChildren)}
      initial='hidden'
      whileInView='show'
      viewport={{ once: true, amount: 0.2 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  )
}

