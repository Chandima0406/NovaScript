import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaSortAmountDown, 
  FaSortAmountUpAlt,
  FaCalendarAlt,
  FaUser,
  FaAngleLeft,
  FaAngleRight
} from 'react-icons/fa';
import { getProjects } from '../api';
import '../styles/SearchEngine.css';

const SearchEngine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  
  const navigate = useNavigate();
  const fetchProjects = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        query: searchQuery,
        author: authorFilter,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        sortBy,
        sortOrder,
        page,
        limit: 10
      };
      
      const response = await getProjects(params);
      setProjects(response.data.projects);
      setPagination(response.data.pagination);
      setCurrentPage(page);    } catch (error) {
      setError('Failed to load research papers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects(1);
  };

  const handlePageChange = (page) => {
    fetchProjects(page);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    fetchProjects(1);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    fetchProjects(1);
  };

  const handleFilterReset = () => {
    setSearchQuery('');
    setAuthorFilter('');
    setDateFrom('');
    setDateTo('');
    setSortBy('createdAt');
    setSortOrder('desc');
    fetchProjects(1);
  };

  return (
    <div className="search-engine-container">
      {/* Action Buttons */}      <div className="action-buttons">
        <button className="action-button start-research" onClick={() => navigate('/start-research')}>
          Start New Research
        </button>
        <button className="action-button" onClick={() => navigate('/ai-assistant')}>AI Assistance</button>
        <button className="action-button" onClick={() => navigate('/publish')}>
          Publish Research
        </button>
        <button className="action-button" onClick={() => navigate('/create-survey')}>Create Survey</button>
        <button className="action-button" onClick={() => navigate('/support-survey')}>Support Survey</button>
      </div>

      {/* Main Heading */}
      <div className="main-heading">
        <h1>Explore Research Projects</h1>
        <p>
          Discover innovative research projects crafted by top academics and institutions.
          Gain insights, collaborate with experts, and stay at the forefront of knowledge and discovery.
        </p>
      </div>      {/* Search Bar */}
      <div className="search-bar-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search Research Titles, Topics, Or Authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FaSearch /> Search
          </button>
        </form>
        
        {/* Filter Toggle */}
        <div className="filter-toggle-container">
          <button 
            type="button" 
            className="filter-toggle-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label>
              <FaUser className="filter-icon" />
              Author
            </label>
            <input
              type="text"
              placeholder="Filter by author"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label>
              <FaCalendarAlt className="filter-icon" />
              Date Range
            </label>
            <div className="date-inputs">
              <input
                type="date"
                placeholder="From"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span>to</span>
              <input
                type="date"
                placeholder="To"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>Sort By</label>
            <div className="sort-controls">
              <select 
                value={sortBy} 
                onChange={handleSortByChange}
                className="sort-select"
              >
                <option value="createdAt">Date</option>
                <option value="title">Title</option>
                <option value="author.name">Author</option>
              </select>
              <button 
                type="button" 
                className="sort-order-button"
                onClick={toggleSortOrder}
              >
                {sortOrder === 'asc' ? <FaSortAmountUpAlt /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>
          
          <button 
            type="button" 
            className="reset-filters-button"
            onClick={handleFilterReset}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="results-summary">
        <span className="results-count">
          {pagination.total} research {pagination.total === 1 ? 'paper' : 'papers'} found
        </span>
      </div>      {/* Research Projects List */}
      {isLoading ? (
        <div className="search-engine-loading-container">
          <div className="search-engine-loading-spinner"></div>
          <p>Loading research papers...</p>
        </div>
      ) : error ? (
        <div className="search-engine-error-container">
          <p>{error}</p>
          <button onClick={() => fetchProjects(1)} className="retry-button">
            Try Again
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-results">
          <h3>No Research Papers Found</h3>
          <p>Try adjusting your search criteria or browse all papers by clearing filters.</p>
          <button onClick={handleFilterReset} className="clear-filters-btn">
            Clear All Filters
          </button>
        </div>
      ) : (        <div className="research-projects-list">
          {projects.map((project) => (
            <div className="research-project-card" key={project._id}>
              <div className="search-engine-project-header">
                <div className="author-avatar">
                  <img src="/path/to/avatar.jpg" alt="Author" />
                </div>
                <div className="author-info">
                  <h3>{project.author.name}</h3>
                  <p>{project.author.role}</p>
                </div>
                <div className="search-engine-project-date">
                  {new Date(project.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="search-engine-project-content">
                <a
                  href={`http://localhost:5000/api/projects/pdf/${project.pdfId}`}
                  className="search-engine-project-title"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  {project.title}
                </a>
                <p className="search-engine-project-description">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination.pages > 1 && !isLoading && !error && projects.length > 0 && (
        <div className="pagination-controls">
          <button 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaAngleLeft /> Previous
          </button>
          
          <div className="pagination-pages">
            {[...Array(Math.min(5, pagination.pages)).keys()].map((i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => handlePageChange(Math.min(pagination.pages, currentPage + 1))}
            disabled={currentPage === pagination.pages}
            className="pagination-button"
          >
            Next <FaAngleRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchEngine;