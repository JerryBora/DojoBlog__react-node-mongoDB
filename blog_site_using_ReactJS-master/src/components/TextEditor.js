import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Link, List, Image, AlignLeft, Edit3, FileText, Code, Quote, Heading } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import '../styles/editor.css'

const MultiModeTextEditor = ({ 
  value, 
  onChange,
  initialMode = 2, // 0: Markdown, 1: Discord, 2: Rich Text
  className = '',
  placeholder = '',
  minHeight = '250px',
  hideModeSwitcher = false,
  isPreview = false
}) => {
  const [editorMode, setEditorMode] = useState(initialMode);
  const textareaRef = useRef(null);
  const previewRef = useRef(null);
  
  // Update editorMode when initialMode changes
  useEffect(() => {
    setEditorMode(initialMode);
  }, [initialMode]);
  
  // Add click handler for spoiler tags
  useEffect(() => {
    if (isPreview && previewRef.current) {
      const spoilerElements = previewRef.current.querySelectorAll('.spoiler');
      
      const handleSpoilerClick = (e) => {
        e.target.classList.toggle('revealed');
      };
      
      spoilerElements.forEach(element => {
        element.addEventListener('click', handleSpoilerClick);
      });
      
      return () => {
        spoilerElements.forEach(element => {
          element.removeEventListener('click', handleSpoilerClick);
        });
      };
    }
  }, [isPreview, value, editorMode]);
  
  const editorModes = [
    { id: 0, name: 'Markdown', icon: <Code size={18} />, color: 'from-blue-500 to-blue-600' },
    { id: 1, name: 'Discord', icon: <Edit3 size={18} />, color: 'from-indigo-500 to-indigo-600' },
    { id: 2, name: 'Rich Text', icon: <FileText size={18} />, color: 'from-purple-500 to-purple-600' }
  ];
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, parseInt(minHeight))}px`;
    }
  }, [value, minHeight]);
  
  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    
    switch (editorMode) {
      case 0:
        return "# Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2\n\n```\ncode block\n```";
      case 1:
        return "**Bold** and *italic*\n||spoiler text||\n```\ncode block\n```\n> Quote";
      case 2:
        return "Start writing your content here...";
      default:
        return "";
    }
  };
  
  const getModeDescription = () => {
    switch (editorMode) {
      case 0:
        return "Advanced Markdown: Use full markdown syntax with code blocks, tables, and more.";
      case 1:
        return "Discord Formatting: Use Discord's text formatting for styled messages.";
      case 2:
        return "Rich Text: What you see is what you get - simple formatting for everyone.";
      default:
        return "";
    }
  };
  
  // Parse Discord formatting to HTML
  const parseDiscordFormat = (text) => {
    if (!text) return '';
    
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Spoiler tags
    text = text.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>');
    
    // Quote
    text = text.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
  };
  
  // Parse Rich Text formatting to HTML
  const parseRichText = (text) => {
    if (!text) return '';
    
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Lists
    text = text.replace(/^- (.*?)$/gm, '<li>$1</li>').replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    
    // Images
    text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="preview-image">');
    
    // Quote
    text = text.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
  };
  
  const insertFormatting = (format) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    let cursorOffset = 0;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](https://example.com)`;
        cursorOffset = selectedText ? -1 : -20;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'List item'}\n- Another item\n`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case 'image':
        formattedText = `![${selectedText || 'alt text'}](https://example.com/image.jpg)`;
        cursorOffset = selectedText ? -1 : -21;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText || 'Quote text'}\n`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case 'heading':
        formattedText = `\n# ${selectedText || 'Heading'}\n`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case 'code':
        formattedText = editorMode === 1 
          ? `\`${selectedText || 'code'}\``
          : `\n\`\`\`\n${selectedText || 'code'}\n\`\`\`\n`;
        cursorOffset = selectedText ? 0 : (editorMode === 1 ? -1 : -4);
        break;
      case 'spoiler':
        if (editorMode === 1) {
          formattedText = `||${selectedText || 'spoiler text'}||`;
          cursorOffset = selectedText ? 0 : -2;
        } else {
          return;
        }
        break;
      default:
        formattedText = selectedText;
    }
    
    const newText = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textareaRef.current.focus();
      const newPosition = start + formattedText.length + cursorOffset;
      textareaRef.current.setSelectionRange(newPosition, newPosition);
    }, 0);
  };
  
  // Render Discord formatting toolbar buttons
  const renderDiscordToolbar = () => (
    <div className="formatting-toolbar">
      <button onClick={() => insertFormatting('bold')} className="format-button" title="Bold">
        <Bold size={18} />
      </button>
      <button onClick={() => insertFormatting('italic')} className="format-button" title="Italic">
        <Italic size={18} />
      </button>
      <button onClick={() => insertFormatting('quote')} className="format-button" title="Quote">
        <Quote size={18} />
      </button>
      <button onClick={() => insertFormatting('code')} className="format-button" title="Code">
        <Code size={18} />
      </button>
      <button onClick={() => insertFormatting('spoiler')} className="format-button" title="Spoiler">
        <span className="px-1 text-sm font-mono">||spoiler||</span>
      </button>
    </div>
  );
  const renderMarkdownToolbar = () => (
    <div className="formatting-toolbar">
      <button onClick={() => insertFormatting('heading')} className="format-button" title="Heading">
        <Heading size={18} />
      </button>
      <button onClick={() => insertFormatting('bold')} className="format-button" title="Bold">
        <Bold size={18} />
      </button>
      <button onClick={() => insertFormatting('italic')} className="format-button" title="Italic">
        <Italic size={18} />
      </button>
      <button onClick={() => insertFormatting('link')} className="format-button" title="Link">
        <Link size={18} />
      </button>
      <button onClick={() => insertFormatting('list')} className="format-button" title="List">
        <List size={18} />
      </button>
      <button onClick={() => insertFormatting('image')} className="format-button" title="Image">
        <Image size={18} />
      </button>
      <button onClick={() => insertFormatting('quote')} className="format-button" title="Quote">
        <Quote size={18} />
      </button>
      <button onClick={() => insertFormatting('code')} className="format-button" title="Code Block">
        <Code size={18} />
      </button>
    </div>
  );
  const renderRichTextToolbar = () => (
    <div className="formatting-toolbar">
      <button onClick={() => insertFormatting('bold')} className="format-button" title="Bold">
        <Bold size={18} />
      </button>
      <button onClick={() => insertFormatting('italic')} className="format-button" title="Italic">
        <Italic size={18} />
      </button>
      <button onClick={() => insertFormatting('link')} className="format-button" title="Link">
        <Link size={18} />
      </button>
      <button onClick={() => insertFormatting('list')} className="format-button" title="List">
        <List size={18} />
      </button>
      <button onClick={() => insertFormatting('image')} className="format-button" title="Image">
        <Image size={18} />
      </button>
      <button onClick={() => insertFormatting('quote')} className="format-button" title="Quote">
        <AlignLeft size={18} />
      </button>
    </div>
  );
  return (
    <div className={`editor-container ${className}`}>
      {isPreview ? (
        <div className="editor-preview">
          <div className="preview-content" ref={previewRef} style={{ minHeight }}>
            {editorMode === 0 ? (
              <div 
                className="markdown-preview"
                dangerouslySetInnerHTML={{ 
                  __html: value ? DOMPurify.sanitize(marked.parse(value)) : 'Nothing to preview' 
                }}
              />
            ) : editorMode === 1 ? (
              <div 
                className="discord-preview"
                dangerouslySetInnerHTML={{ 
                  __html: value ? DOMPurify.sanitize(parseDiscordFormat(value)) : 'Nothing to preview' 
                }}
              />
            ) : (
              <div 
                className="richtext-preview"
                dangerouslySetInnerHTML={{ 
                  __html: value ? DOMPurify.sanitize(parseRichText(value)) : 'Nothing to preview' 
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <>
          {!hideModeSwitcher && (
            <div className="editor-header">
              <p className="editor-description">{getModeDescription()}</p>
              <div className="editor-modes">
                {editorModes.map((mode) => (
                  <button
                    key={mode.id}
                    className={`mode-button ${editorMode === mode.id ? 'active' : ''}`}
                    onClick={() => setEditorMode(mode.id)}
                  >
                    <span className="mr-1">{mode.icon}</span>
                    {mode.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="editor-wrapper">
            {editorMode === 2 ? renderRichTextToolbar() : 
             editorMode === 1 ? renderDiscordToolbar() : 
             renderMarkdownToolbar()}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="editor-textarea"
              placeholder={getPlaceholderText()}
            ></textarea>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiModeTextEditor;