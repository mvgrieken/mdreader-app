import React, { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Keyboard Shortcuts Hook
 */
export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  action: () => void
  description?: string
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matchesKey = e.key.toLowerCase() === shortcut.key.toLowerCase()
        const matchesCtrl = !!shortcut.ctrlKey === e.ctrlKey
        const matchesShift = !!shortcut.shiftKey === e.shiftKey
        const matchesAlt = !!shortcut.altKey === e.altKey
        const matchesMeta = !!shortcut.metaKey === e.metaKey

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
          e.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

/**
 * Keyboard Navigation List Component
 */
export interface KeyboardNavigationItem {
  id: string
  label: string
  element?: HTMLElement
  disabled?: boolean
}

export interface KeyboardNavigationListProps {
  items: KeyboardNavigationItem[]
  onSelect?: (id: string) => void
  orientation?: 'vertical' | 'horizontal'
  loop?: boolean
  className?: string
  children: (item: KeyboardNavigationItem, index: number, isFocused: boolean) => React.ReactNode
}

export const KeyboardNavigationList: React.FC<KeyboardNavigationListProps> = ({
  items,
  onSelect,
  orientation = 'vertical',
  loop = true,
  className,
  children
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const focusItem = useCallback((index: number) => {
    if (index < 0 || index >= items.length) return
    
    const item = items[index]
    if (item.disabled) {
      // Find next non-disabled item
      let nextIndex = index
      const direction = orientation === 'vertical' ? 1 : 1
      
      do {
        nextIndex = (nextIndex + direction + items.length) % items.length
      } while (items[nextIndex].disabled && nextIndex !== index)
      
      if (items[nextIndex].disabled) return
      setFocusedIndex(nextIndex)
    } else {
      setFocusedIndex(index)
    }
  }, [items, orientation])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight':
        e.preventDefault()
        if (focusedIndex < items.length - 1) {
          focusItem(focusedIndex + 1)
        } else if (loop) {
          focusItem(0)
        }
        break
        
      case orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft':
        e.preventDefault()
        if (focusedIndex > 0) {
          focusItem(focusedIndex - 1)
        } else if (loop) {
          focusItem(items.length - 1)
        }
        break
        
      case 'Home':
        e.preventDefault()
        focusItem(0)
        break
        
      case 'End':
        e.preventDefault()
        focusItem(items.length - 1)
        break
        
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0 && !items[focusedIndex].disabled && onSelect) {
          onSelect(items[focusedIndex].id)
        }
        break
        
      case 'Escape':
        e.preventDefault()
        setFocusedIndex(-1)
        containerRef.current?.blur()
        break
    }
  }, [focusedIndex, items, onSelect, orientation, loop, focusItem])

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0) {
      const element = items[focusedIndex]?.element
      if (element) {
        element.focus()
      }
    }
  }, [focusedIndex, items])

  return (
    <div
      ref={containerRef}
      className={cn('outline-none', className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role={orientation === 'vertical' ? 'listbox' : 'tablist'}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          role={orientation === 'vertical' ? 'option' : 'tab'}
          aria-selected={focusedIndex === index}
          aria-disabled={item.disabled}
          tabIndex={focusedIndex === index ? 0 : -1}
        >
          {children(item, index, focusedIndex === index)}
        </div>
      ))}
    </div>
  )
}

/**
 * Command Palette Component
 */
export interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  commands: Array<{
    id: string
    title: string
    description?: string
    shortcut?: string
    action: () => void
    category?: string
  }>
  placeholder?: string
  className?: string
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  placeholder = "Type a command...",
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Filter commands based on search
  const filteredCommands = commands.filter(command => 
    command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchTerm])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
        break
        
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
        break
        
      case 'Enter':
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
          onClose()
        }
        break
        
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  const handleCommandClick = (command: typeof commands[0]) => {
    command.action()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Command Palette */}
      <div className={cn(
        'relative w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700',
        'overflow-hidden',
        className
      )}>
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex-1 flex items-center space-x-3">
            <div className="w-5 h-5 text-neutral-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Commands List */}
        <div 
          ref={listRef}
          className="max-h-96 overflow-y-auto"
          role="listbox"
        >
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
              No commands found
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                onClick={() => handleCommandClick(command)}
                className={cn(
                  'w-full px-4 py-3 flex items-center space-x-3 text-left transition-colors',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                  index === selectedIndex && 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
                  'focus:outline-none focus:bg-primary-50 dark:focus:bg-primary-900/20'
                )}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-900 dark:text-neutral-50">
                    {command.title}
                  </div>
                  {command.description && (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {command.description}
                    </div>
                  )}
                </div>
                {command.shortcut && (
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                    {command.shortcut}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
            <div>
              {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Keyboard Shortcuts Help Component
 */
export const KeyboardShortcutsHelp: React.FC<{
  shortcuts: Array<{
    keys: string[]
    description: string
  }>
  className?: string
}> = ({ shortcuts, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {shortcuts.map((shortcut, index) => (
        <div key={index} className="flex items-center justify-between py-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-300">
            {shortcut.description}
          </span>
          <div className="flex items-center space-x-1">
            {shortcut.keys.map((key, keyIndex) => (
              <React.Fragment key={keyIndex}>
                {keyIndex > 0 && (
                  <span className="text-neutral-400 dark:text-neutral-500 mx-1">+</span>
                )}
                <kbd className="px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded">
                  {key}
                </kbd>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Global Keyboard Navigation Provider
 */
export interface KeyboardNavigationProviderProps {
  children: React.ReactNode
  shortcuts?: KeyboardShortcut[]
}

export const KeyboardNavigationProvider: React.FC<KeyboardNavigationProviderProps> = ({
  children,
  shortcuts = []
}) => {
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  // Default shortcuts
  const defaultShortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => setShowCommandPalette(true),
      description: 'Open command palette'
    },
    {
      key: '/',
      action: () => {
        // Focus search input
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement
        searchInput?.focus()
      },
      description: 'Focus search'
    },
    ...shortcuts
  ]

  useKeyboardShortcuts(defaultShortcuts)

  return (
    <>
      {children}
      {showCommandPalette && (
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          commands={defaultShortcuts.map(shortcut => ({
            id: shortcut.description || shortcut.key,
            title: shortcut.description || shortcut.key,
            action: shortcut.action
          }))}
        />
      )}
    </>
  )
}
