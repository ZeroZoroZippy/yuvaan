import React from 'react';
import { Link } from 'react-router-dom';
import { getRecentPosts } from '../data/blogData';

function BlogPreview() {
  const recentPosts = getRecentPosts(2); // Show 2 most recent posts

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          Latest Blog Posts
        </h3>
        <Link 
          to="/blog"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View All →
        </Link>
      </div>
      
      <div className="space-y-4">
        {recentPosts.map((post) => (
          <article key={post.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <Link to={`/blog/${post.id}`} className="block group">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                {post.title}
              </h4>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogPreview;