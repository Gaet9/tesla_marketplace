import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImageUploadSection = ({ 
  images = [], 
  onImagesChange, 
  errors = {},
  currentStep 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const maxImages = 20;
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const validFiles = files?.filter(file => {
      if (!allowedTypes?.includes(file?.type)) {
        alert(`File ${file?.name} is not a supported image format`);
        return false;
      }
      if (file?.size > maxFileSize) {
        alert(`File ${file?.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    if (images?.length + validFiles?.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Simulate file upload with progress
    const newImages = [];
    for (const file of validFiles) {
      const imageId = Date.now() + Math.random();
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [imageId]: 0 }));
      
      // Mock upload simulation
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [imageId]: progress }));
      }
      
      // Mock uploaded URL (in real app, this would be from Supabase Storage)
      const uploadedUrl = `https://images.unsplash.com/photo-${Date.now()}-${Math.floor(Math.random() * 1000)}?w=800&h=600&fit=crop&crop=center`;
      
      newImages?.push({
        id: imageId,
        file,
        url: uploadedUrl,
        preview: previewUrl,
        isPrimary: images?.length === 0 && newImages?.length === 0,
        alt: `Tesla vehicle exterior view showing ${file?.name?.includes('interior') ? 'interior dashboard and seats' : 'side profile and wheels'}`
      });
      
      setUploadProgress(prev => {
        const updated = { ...prev };
        delete updated?.[imageId];
        return updated;
      });
    }

    onImagesChange([...images, ...newImages]);
  };

  const removeImage = (imageId) => {
    const updatedImages = images?.filter(img => img?.id !== imageId);
    
    // If we removed the primary image, make the first remaining image primary
    if (updatedImages?.length > 0 && !updatedImages?.some(img => img?.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    
    onImagesChange(updatedImages);
  };

  const setPrimaryImage = (imageId) => {
    const updatedImages = images?.map(img => ({
      ...img,
      isPrimary: img?.id === imageId
    }));
    onImagesChange(updatedImages);
  };

  const reorderImages = (dragIndex, hoverIndex) => {
    const draggedImage = images?.[dragIndex];
    const updatedImages = [...images];
    updatedImages?.splice(dragIndex, 1);
    updatedImages?.splice(hoverIndex, 0, draggedImage);
    onImagesChange(updatedImages);
  };

  if (currentStep !== 2) return null;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Vehicle Photos</h3>
          <span className="text-sm text-muted-foreground">
            {images?.length}/{maxImages} photos
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Upload high-quality photos of your Tesla. The first image will be used as the main photo.
          Include exterior, interior, and any notable features or damage.
        </p>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center tesla-transition ${
            dragActive 
              ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Upload" size={24} className="text-muted-foreground" />
            </div>
            
            <div>
              <p className="text-foreground font-medium">
                Drag and drop your photos here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse files
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span>JPEG, PNG, WebP</span>
              <span>•</span>
              <span>Max 10MB each</span>
              <span>•</span>
              <span>Up to {maxImages} photos</span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              iconName="Plus"
              iconPosition="left"
            >
              Select Photos
            </Button>
          </div>
        </div>

        {errors?.images && (
          <p className="text-sm text-destructive mt-2">{errors?.images}</p>
        )}
      </div>
      {/* Image Grid */}
      {images?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-md font-semibold text-card-foreground mb-4">Uploaded Photos</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images?.map((image, index) => (
              <div
                key={image?.id}
                className="relative group bg-muted rounded-lg overflow-hidden aspect-square"
              >
                <Image
                  src={image?.preview || image?.url}
                  alt={image?.alt}
                  className="w-full h-full object-cover"
                />
                
                {/* Upload Progress */}
                {uploadProgress?.[image?.id] !== undefined && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs text-foreground">{uploadProgress?.[image?.id]}%</p>
                    </div>
                  </div>
                )}
                
                {/* Primary Badge */}
                {image?.isPrimary && (
                  <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                    Primary
                  </div>
                )}
                
                {/* Image Controls */}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 tesla-transition flex items-center justify-center">
                  <div className="flex space-x-2">
                    {!image?.isPrimary && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPrimaryImage(image?.id)}
                        iconName="Star"
                      >
                      </Button>
                    )}
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(image?.id)}
                      iconName="Trash2"
                    >
                    </Button>
                  </div>
                </div>
                
                {/* Image Number */}
                <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-xs">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h5 className="text-sm font-medium text-foreground mb-2">Photo Tips:</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Take photos in good lighting conditions</li>
              <li>• Include exterior shots from all angles</li>
              <li>• Show interior, dashboard, and seats</li>
              <li>• Capture any damage or wear honestly</li>
              <li>• Include photos of unique features or upgrades</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;