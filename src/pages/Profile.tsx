import React, { useState } from 'react';
import { Camera, Pencil, CreditCard, Computer, LogOut, X, Check, Mail, Phone, Building, Globe, Plus, User2, Building2, CreditCard as BillingIcon, Eye, EyeOff } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const plans = [
    {
      name: 'Basic',
      price: 49,
      features: ['Up to 20 surveys per month', 'Basic report templates', 'Email support'],
      current: true
    },
    {
      name: 'Professional',
      price: 99,
      features: ['Unlimited surveys', 'Custom report templates', 'Priority support', 'API access'],
    },
    {
      name: 'Enterprise',
      price: 249,
      features: ['Custom everything', 'Dedicated support', 'SLA guarantee', 'Custom integrations']
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiry: '04/24',
      default: true
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '5555',
      expiry: '07/25',
      default: false
    }
  ];

  const billingHistory = [
    {
      id: 'INV-2024-001',
      date: 'Mar 1, 2024',
      amount: 99.00,
      status: 'Paid'
    },
    {
      id: 'INV-2024-002',
      date: 'Feb 1, 2024',
      amount: 99.00,
      status: 'Paid'
    }
  ];

  const renderPersonalContent = () => (
    <div className="p-8">
      {/* Personal Information */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value="John Doe"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value="john.doe@example.com"
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value="+1 (555) 123-4567"
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value="Melbourne, Australia"
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Where you're logged in */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Where you're logged in</h2>
            <p className="mt-1 text-sm text-gray-500">
              We'll alert you via email if there is any unusual activity on your account
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Computer className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">2018 Macbook Pro 15-inch</p>
                <p className="text-sm text-gray-500">Melbourne, Australia • 22 Jan at 4:20pm</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active Now
            </span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Computer className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">2020 Macbook Air M1</p>
                <p className="text-sm text-gray-500">Melbourne, Australia • 22 Jan at 4:20pm</p>
              </div>
            </div>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <div className="mt-1 relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="mt-1 relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className="block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Your password must be more than 8 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <div className="mt-1 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      className="block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBillingContent = () => (
    <div className="p-8">
      {/* Current Plan */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-xl border ${
                plan.current
                  ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md transition-all'
              }`}
            >
              {plan.current && (
                <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Current Plan
                </span>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                  <span className="text-base font-normal text-gray-500">/month</span>
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <button
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                    plan.current
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Card
          </button>
        </div>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {method.default && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                )}
                <button className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingHistory.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-700">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Add Payment Method</h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="default"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="default" className="ml-2 text-sm text-gray-700">
                    Set as default payment method
                  </label>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompanyContent = () => (
    <div className="p-8">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
          <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value="Marine Surveys Ltd"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Type</label>
            <input
              type="text"
              value="Marine Survey Company"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Number</label>
            <input
              type="text"
              value="REG123456789"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax ID</label>
            <input
              type="text"
              value="TAX987654321"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Business Address</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Street Address</label>
            <input
              type="text"
              value="123 Harbor Street"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value="Melbourne"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State/Province</label>
            <input
              type="text"
              value="Victoria"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              value="3000"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              value="Australia"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow">
              {/* Profile Header */}
              {/* Profile Image */}
              <div className="relative px-8 pt-8 pb-4 flex justify-between items-end border-b border-gray-200">
                <div className="flex items-end space-x-4">
                  <div className="relative inline-block">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80"
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                    />
                    <button className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-sm hover:shadow transition-shadow">
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="absolute -right-1 top-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
                    <p className="text-gray-500">Marine Surveyor</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="px-8 pt-6">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'personal'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User2 className="h-4 w-4" />
                    <span>
                    Personal Info
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('company')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'company'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>
                    Company
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'billing'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <BillingIcon className="h-4 w-4" />
                    <span>
                    Billing
                    </span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'personal' ? (
                  renderPersonalContent()
                ) : activeTab === 'company' ? (
                  renderCompanyContent()
                ) : (
                  renderBillingContent()
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;