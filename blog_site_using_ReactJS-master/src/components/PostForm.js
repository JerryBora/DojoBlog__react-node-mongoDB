import React, { useState, useEffect } from 'react';
import '../styles/editor.css';

import { useHistory } from 'react-router-dom';
import { postAPI } from '../services/api';
import { Check, Save, Code, Edit3, FileText } from 'lucide-react';
import '../styles/saveIndicator.css';
import MultiModeTextEditor from './TextEditor';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editorMode, setEditorMode] = useState(2); // 0: Markdown, 1: Discord, 2: Rich Text
  const [isPreview, setIsPreview] = useState(false);
  const history = useHistory();

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

  // Auto-save functionality with debounce
  useEffect(() => {
    let saveTimer;
    
    const performAutoSave = async () => {
      if (title.trim() || content.trim()) {
        setIsSaving(true);
        try {
          // Simulate API call - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setSavedRecently(true);
          // Reset saved indicator after 3 seconds
          setTimeout(() => setSavedRecently(false), 3000);
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }
    };

    // Set up debounced auto-save
    if (title.trim() || content.trim()) {
      saveTimer = setTimeout(performAutoSave, 5000);
    }
    
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [title, content]);

  const [showTitleError, setShowTitleError] = useState(false);
  const [showContentError, setShowContentError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error states
    setShowTitleError(false);
    setShowContentError(false);
    
    // Validate fields
    if (!title.trim()) {
      setShowTitleError(true);
      return;
    }
    if (!content.trim()) {
      setShowContentError(true);
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      await postAPI.createPost({ title, content });
      history.push('/blogs');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed handleAutoSave as it's now integrated into the useEffect

  return (
    <div className="post-form-container">
      <main className="post-form-main">
        <form onSubmit={handleSubmit} className="post-form">
          <div className="post-form-header">
            <h1 className="form-title">Create a New Post</h1>
            <div className="post-form-actions">
              <div className="button-group">
                <div className={`save-indicator-container ${isSaving ? 'saving' : savedRecently ? 'saved' : 'hidden'}`}>
                  <div className="save-indicator">
                    {isSaving ? (
                      <>
                        <Save size={18} className="save-icon spinning" />
                        <span className="save-text">Saving...</span>
                      </>
                    ) : savedRecently ? (
                      <>
                        <Check size={18} className="save-icon success" />
                        <span className="save-text success">Saved</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  className={`preview-toggle ${isPreview ? 'active' : ''}`}
                  onClick={() => setIsPreview(!isPreview)}
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
          {error && <div className="error-message mb-6">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setShowTitleError(false);
              }}
              className={`form-input ${showTitleError ? 'border-red-500' : ''}`}
              placeholder="Enter your post title"
              noValidate
            />
            {showTitleError && (
              <div className="error-message">Please enter a title</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="content" className="form-label">Content</label>
            <p className="editor-description">{getModeDescription()}</p>
            <div className="editor-layout">
              <div className="vertical-mode-buttons">
                <button
                  className={`mode-button ${editorMode === 0 ? 'active' : ''}`}
                  onClick={() => setEditorMode(0)}
                  title="Markdown Mode"
                >
                  <Code size={18} />
                </button>
                <button
                  className={`mode-button ${editorMode === 1 ? 'active' : ''}`}
                  onClick={() => setEditorMode(1)}
                  title="Discord Mode"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  className={`mode-button ${editorMode === 2 ? 'active' : ''}`}
                  onClick={() => setEditorMode(2)}
                  title="Rich Text Mode"
                >
                  <FileText size={18} />
                </button>
              </div>
              <div className="editor-content">
                <MultiModeTextEditor
                  value={content}
                  onChange={(value) => {
                    setContent(value);
                    if (value.trim()) setShowContentError(false);
                  }}
                  initialMode={editorMode}
                  className={`rich-text-editor ${showContentError ? 'border-red-500' : ''}`}
                  placeholder="Write your post content here..."
                  minHeight="300px"
                  hideModeSwitcher={true}
                  isPreview={isPreview}
                />
              </div>
            </div>
            {showContentError && (
              <div className="error-message">Please enter some content</div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default PostForm;