import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const MarkdownEditor = ({ initialContent = '# Project README\n\nThis is the project README content.\nYou can edit this markdown text.' }: { initialContent?: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the content to a backend or local storage
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <Button onClick={toggleEdit} variant="outline">
          {isEditing ? 'Preview' : 'Edit'}
        </Button>
        {isEditing && (
          <Button onClick={handleSave} variant="default" className="ml-2">
            Save
          </Button>
        )}
      </div>
      {isEditing ? (
        <Textarea
          value={content}
          onChange={handleContentChange}
          className="w-full h-64 p-2 border rounded-md"
          placeholder="Write your markdown content here..."
        />
      ) : (
        <div className="markdown-viewer border p-2 rounded-md min-h-[200px] bg-white">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
