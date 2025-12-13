import React, { useState, useEffect } from 'react';
import './UserTabs.css';
import BuffaloTree from './BuffaloTree';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Product Image Carousel Component
const ProductImageCarousel: React.FC<{ images: string[], breed: string, inStock: boolean }> = ({ images, breed, inStock }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
      <img 
        src={images[currentImageIndex]} 
        alt={`${breed} - Image ${currentImageIndex + 1}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          filter: inStock ? 'none' : 'grayscale(30%)'
        }}
      />
      
      {/* Navigation arrows - only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            ‹
          </button>
          <button
            onClick={nextImage}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            ›
          </button>
        </>
      )}
      
      {/* Image indicators - only show if multiple images */}
      {images.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '4px'
        }}>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Out of stock overlay */}
      {!inStock && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: '#dc2626',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          Out of Stock
        </div>
      )}
    </div>
  );
};

const UserTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nonVerified' | 'existing' | 'tree' | 'products'>('nonVerified');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    mobile: '',
    first_name: '',
    last_name: '',
    refered_by_mobile: '',
    refered_by_name: '',
  });
  const [editFormData, setEditFormData] = useState({
    mobile: '',
    first_name: '',
    last_name: '',
    refered_by_mobile: '',
    refered_by_name: '',
  });
  const [referralUsers, setReferralUsers] = useState<any[]>([]);
  const [existingCustomers, setExistingCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchReferralUsers = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getReferrals());
        setReferralUsers(response.data.users || []);
      } catch (error) {
        setReferralUsers([]); // Clear users on error
      }
    };

    const fetchExistingCustomers = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getUsers());
        setExistingCustomers(response.data.users || []);
      } catch (error) {
        setExistingCustomers([]); // Clear users on error
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getProducts());
        // Extract products array from the response structure
        const productsData = response.data?.products || [];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Clear products on error
      }
    };

    // Only fetch data for the user-related tabs. The 'tree' tab is client-side.
    if (activeTab === 'nonVerified') {
      fetchReferralUsers();
    } else if (activeTab === 'existing') {
      fetchExistingCustomers();
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const handleCreateClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ENDPOINTS.createUser(), {
        mobile: formData.mobile,
        first_name: formData.first_name,
        last_name: formData.last_name,
        refered_by_mobile: formData.refered_by_mobile,
        refered_by_name: formData.refered_by_name,
      });
      
      console.log('User response:', response.data);
      
      // Check if user already exists
      if (response.data.message === 'User already exists') {
        alert('User already exists with this mobile number.');
      } else {
        alert('User created successfully!');
      }
      
      // Close modal and reset form
      setShowModal(false);
      setFormData({
        mobile: '',
        first_name: '',
        last_name: '',
        refered_by_mobile: '',
        refered_by_name: '',
      });
      
      // Refresh the referral users list
      if (activeTab === 'nonVerified') {
        const refreshResponse = await axios.get(API_ENDPOINTS.getReferrals());
        setReferralUsers(refreshResponse.data.users || []);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please try again.');
    }
  };

  const handleRowClick = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      mobile: user.mobile,
      first_name: user.first_name,
      last_name: user.last_name,
      refered_by_mobile: user.refered_by_mobile || '',
      refered_by_name: user.refered_by_name || '',
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/users/${editingUser.mobile}`, {
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        refered_by_mobile: editFormData.refered_by_mobile,
        refered_by_name: editFormData.refered_by_name,
      });
      
      console.log('User updated:', response.data);
      alert('User updated successfully!');
      
      // Close modal and reset form
      setShowEditModal(false);
      setEditingUser(null);
      setEditFormData({
        mobile: '',
        first_name: '',
        last_name: '',
        refered_by_mobile: '',
        refered_by_name: '',
      });
      
      // Refresh the referral users list
      const refreshResponse = await axios.get('http://localhost:8000/users/referrals');
      setReferralUsers(refreshResponse.data.users || []);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={activeTab === 'nonVerified' ? 'active' : ''}
          onClick={() => setActiveTab('nonVerified')}
        >
          Referral
        </button>
        <button
          className={activeTab === 'existing' ? 'active' : ''}
          onClick={() => setActiveTab('existing')}
        >
          Verified Users
        </button>
        <button
          className={activeTab === 'tree' ? 'active' : ''}
          onClick={() => setActiveTab('tree')}
        >
          Buffalo Tree
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'nonVerified' ? (
          <div>
            <h2>Referrals</h2>
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Referred By</th>
                    <th>Referrer Mobile</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {referralUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>No users found</td>
                    </tr>
                  ) : (
                    referralUsers.map((user: any, index: number) => (
                      <tr key={index}>
                        <td>{user.first_name} {user.last_name}</td>
                        <td>{user.mobile}</td>
                        <td>{user.refered_by_name || '-'}</td>
                        <td>{user.refered_by_mobile || '-'}</td>
                        <td>
                          <button
                            onClick={() => handleRowClick(user)}
                            style={{
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#2563eb';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#3b82f6';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'existing' ? (
          <div>
            <h2>Verified Users</h2>
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th style={{ whiteSpace: 'nowrap' }}>First Name</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Last Name</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Mobile</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Form Filled</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Referred By</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Referrer Mobile</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {existingCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>No users found</td>
                    </tr>
                  ) : (
                    existingCustomers.map((user: any, index: number) => (
                      <tr key={index}>
                        <td>{user.first_name || '-'}</td>
                        <td>{user.last_name || '-'}</td>
                        <td>{user.mobile}</td>
                        <td>{user.isFormFilled ? 'Yes' : 'No'}</td>
                        <td>{user.refered_by_name || '-'}</td>
                        <td>{user.refered_by_mobile || '-'}</td>
                        <td>{user.verified ? 'Yes' : 'No'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'tree' ? (
          <div>
            {/* Buffalo Tree tab content */}
            <div style={{ padding: '1rem' }}>
              <h2>Buffalo Family Tree</h2>
              <div className="tree-wrapper">
                {/* Render BuffaloTree component */}
                <div id="buffalo-tree-root">
                  <BuffaloTree />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Products tab content */}
            {activeTab === 'products' && (
              <div style={{ padding: '1rem' }}>
                <h2>Products</h2>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '1.5rem', 
                  marginTop: '1rem' 
                }}>
                  {products.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', padding: '2rem' }}>
                      No products found
                    </div>
                  ) : (
                    products.map((product: any, index: number) => (
                      <div key={product.id || index} style={{ 
                        background: '#fff', 
                        borderRadius: '12px', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb',
                        opacity: product.inStock ? 1 : 0.6,
                        filter: product.inStock ? 'none' : 'grayscale(50%)'
                      }}>
                        {/* Product Image Carousel */}
                        {product.buffalo_images && product.buffalo_images.length > 0 && (
                          <ProductImageCarousel 
                            images={product.buffalo_images} 
                            breed={product.breed}
                            inStock={product.inStock}
                          />
                        )}
                        
                        {/* Product Details */}
                        <div style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#111' }}>
                              {product.breed}
                            </h3>
                            <span style={{ 
                              background: product.inStock ? '#10b981' : '#dc2626', 
                              color: 'white', 
                              padding: '2px 6px', 
                              borderRadius: '4px', 
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                          
                          <div style={{ marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                              <strong>Age:</strong> {product.age} years
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                              <strong>Location:</strong> {product.location}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              <strong>ID:</strong> {product.id}
                            </div>
                          </div>
                          
                          <p style={{ 
                            fontSize: '0.875rem', 
                            color: '#374151', 
                            lineHeight: '1.4', 
                            margin: '0 0 1rem 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {product.description}
                          </p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111' }}>
                                ₹{product.price?.toLocaleString()}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                Insurance: ₹{product.insurance?.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating + Icon at bottom left - only show on Referral tab */}
      {activeTab === 'nonVerified' && (
        <button
          onClick={handleCreateClick}
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '32px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          aria-label="Add New Referral"
        >
          +
        </button>
      )}

      {showModal && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#9ca3af',
                cursor: 'pointer',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              ×
            </button>
            <h3>Add New Referral</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Mobile:
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter mobile number"
                />
              </label>
              <label>
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter first name"
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter last name"
                />
              </label>
              <label>
                Referred By(Mobile):
                <input
                  type="tel"
                  name="refered_by_mobile"
                  value={formData.refered_by_mobile}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter referrer's mobile"
                />
              </label>
              <label>
                Referred By(Name):
                <input
                  type="text"
                  name="refered_by_name"
                  value={formData.refered_by_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter referrer's name"
                />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={handleCloseModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="modal" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={handleCloseEditModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#9ca3af',
                cursor: 'pointer',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              ×
            </button>
            <h3>Edit Referral</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Mobile:
                <input
                  type="tel"
                  name="mobile"
                  value={editFormData.mobile}
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  placeholder="Mobile number (cannot be changed)"
                />
              </label>
              <label>
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleEditInputChange}
                  required
                  placeholder="Enter first name"
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleEditInputChange}
                  required
                  placeholder="Enter last name"
                />
              </label>
              <label>
                Referred By(Mobile):
                <input
                  type="tel"
                  name="refered_by_mobile"
                  value={editFormData.refered_by_mobile}
                  onChange={handleEditInputChange}
                  required
                  placeholder="Enter referrer's mobile"
                />
              </label>
              <label>
                Referred By(Name):
                <input
                  type="text"
                  name="refered_by_name"
                  value={editFormData.refered_by_name}
                  onChange={handleEditInputChange}
                  required
                  placeholder="Enter referrer's name"
                />
              </label>
              <button type="submit">Update</button>
              <button type="button" onClick={handleCloseEditModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTabs;