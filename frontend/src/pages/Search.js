import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../contexts/AuthContext';
import './Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const { isAuthenticated } = useAuth();
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm && isAuthenticated) {
      performSearch();
    } else if (!isAuthenticated) {
      setError('Please login to search videos');
    }
  }, [searchTerm, isAuthenticated]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/v1/videos/search?searchterm=${encodeURIComponent(searchTerm)}`);
      setVideos(response.data.data || []);
    } catch (error) {
      console.error('Error searching videos:', error);
      setError('Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="search-page">
        <div className="search-container">
          <div className="error">Please login to search videos</div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-container">
        <h2 className="search-title">
          {searchTerm ? `Search results for "${searchTerm}"` : 'Search Videos'}
        </h2>

        {loading && <div className="loading">Searching...</div>}
        
        {error && <div className="error">{error}</div>}

        {!loading && !error && videos.length === 0 && searchTerm && (
          <div className="no-results">
            <p>No videos found for "{searchTerm}"</p>
            <p>Try different keywords or check your spelling</p>
          </div>
        )}

        {!loading && videos.length > 0 && (
          <div className="search-results">
            <p className="results-count">{videos.length} video(s) found</p>
            <div className="videos-grid">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;