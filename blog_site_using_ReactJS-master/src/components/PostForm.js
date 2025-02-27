import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Bold, Italic, Link, List, Image, AlignLeft, Edit3, FileText, Code, Check, Save } from 'lucide-react';

const PostForm = () => {
  const [sliderPosition, setSliderPosition] = useState(2); // 0: Markdown, 1: Discord, 2: Rich Text
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const history = useHistory();

  const editorModes = [
    { id: 0, name: 'Markdown', icon: <Code size={18} />, color: 'from-blue-500 to-blue-600' },
    { id: 1, name: 'Discord', icon: <Edit3 size={18} />, color: 'from-indigo-500 to-indigo-600' },
    { id: 2, name: 'Rich Text', icon: <FileText size={18} />, color: 'from-purple-500 to-purple-600' }
  ];

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Simulate auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (title.trim() || content.trim()) {
        handleAutoSave();
      }
    }, 5000);
    
    return () => clearTimeout(saveTimer);
  }, [title, content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      history.push('/blogs');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSave = () => {
    if (isSaving) return; // Prevent multiple simultaneous saves
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedRecently(true);
      setTimeout(() => setSavedRecently(false), 3000);
    }, 1000);
  };

  // Add these functions here, before the return statement
  const getPlaceholderText = () => {
    switch (sliderPosition) {
      case 0:
        return "# Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2\n\n```\ncode block\n```";
      case 1:
        return "**Bold** and *italic*\n||spoiler text||\n```\ncode block\n```\n> Quote";
      case 2:
        return "Start writing your post here...";
      default:
        return "";
    }
  };
  
  const getModeDescription = () => {
    switch (sliderPosition) {
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
  
  const insertFormatting = (format) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'List item'}\n- Another item\n`;
        break;
      case 'image':
        formattedText = `![${selectedText || 'alt text'}](https://example.com/image.jpg)`;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText || 'Quote text'}\n`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newText = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newText);
    
    setTimeout(() => {
      textareaRef.current.focus();
      const newPosition = start + formattedText.length;
      textareaRef.current.setSelectionRange(newPosition, newPosition);
    }, 0);
  };
  
  const markdownPatterns = [
    { pattern: /^# (.*$)/gm, replacement: '<h1 class="text-2xl font-bold my-4">$1</h1>' },
    { pattern: /^## (.*$)/gm, replacement: '<h2 class="text-xl font-bold my-3">$1</h2>' },
    { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
    { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
    { pattern: /^- (.*$)/gm, replacement: '<li class="ml-4">$1</li>' },
    { pattern: /(<li.*<\/li>)/gs, replacement: '<ul class="list-disc my-2">$1</ul>' },
    { pattern: /\[(.*?)\]\((.*?)\)/g, replacement: '<a href="$2" class="text-purple-600 underline">$1</a>' },
    { pattern: /```([\s\S]*?)```/g, replacement: '<pre class="bg-gray-100 p-2 my-2 rounded font-mono text-sm overflow-x-auto">$1</pre>' },
    { pattern: /^> (.*$)/gm, replacement: '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">$1</blockquote>' },
    { pattern: /\n/g, replacement: '<br>' }
  ];

  const renderMarkdown = () => {
    return markdownPatterns.reduce((html, { pattern, replacement }) => 
      html.replace(pattern, replacement), content);
  };

  return (
    <div className="post-form-container">
      <main className="post-form-main">
        <form onSubmit={handleSubmit} className="post-form">
          <div className="post-form-header">
            <h2 className="post-form-title">Create a New Post</h2>
            <div className="post-form-actions">
              {isSaving && (
                <div className="saving-indicator">
                  <Save size={14} className="saving-icon" /> Saving...
                </div>
              )}
              {savedRecently && (
                <div className="saved-indicator">
                  <Check size={14} className="saved-icon" /> Saved
                </div>
              )}
              <button 
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`preview-toggle ${
                  previewMode 
                    ? 'active' : ''
                }`}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>

          {error && <div className="error-message mb-6">{error}</div>}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? 'Creating Post...' : 'Create Post'}
          </button>
          
          {!previewMode ? (
            <>
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="Enter your post title"
                  required
                />
              </div>
              
              <div className="editor-container">
                <div className="editor-content">
                  <div className="editor-header">
                    <label htmlFor="content" className="form-label-content">Content</label>
                    <div className="editor-modes">
                      <div className="mobile-mode-buttons">
                        {editorModes.map((mode) => (
                          <button
                            type="button"
                            key={mode.id}
                            className={`mobile-mode-button ${
                              sliderPosition === mode.id 
                                ? 'active' : ''
                            }`}
                            onClick={() => setSliderPosition(mode.id)}
                          >
                            <span className="mode-icon">{mode.icon}</span>
                            {mode.name}
                          </button>
                        ))}
                      </div>
                      <div className="desktop-mode-indicator">
                        {editorModes[sliderPosition].name} Mode
                      </div>
                    </div>
                  </div>
                  
                  <p className="mode-description">{getModeDescription()}</p>
                  
                  {sliderPosition === 2 && (
                    <div className="rich-text-editor">
                      <div className="formatting-toolbar">
                        <button type="button" onClick={() => insertFormatting('bold')} className="format-button"><Bold size={18} /></button>
                        <button type="button" onClick={() => insertFormatting('italic')} className="format-button"><Italic size={18} /></button>
                        <button type="button" onClick={() => insertFormatting('link')} className="format-button"><Link size={18} /></button>
                        <button type="button" onClick={() => insertFormatting('list')} className="format-button"><List size={18} /></button>
                        <button type="button" onClick={() => insertFormatting('quote')} className="format-button"><AlignLeft size={18} /></button>
                      </div>
                      <textarea
                        ref={textareaRef}
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="form-textarea"
                        placeholder={getPlaceholderText()}
                        required
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="preview-content" dangerouslySetInnerHTML={{ __html: renderMarkdown() }} />
          )}
        </form>
      </main>
    </div>
  );
};

export default PostForm;