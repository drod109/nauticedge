import React, { useState, useEffect } from 'react';
import { Key, Webhook, Plug, Lock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const APISection = () => {
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string>('basic');
  const [stats, setStats] = useState({
    activeKeys: 0,
    webhooks: 0,
    lastKeyUsed: null as string | null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch subscription plan
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('plan')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .single();

        setCurrentPlan(subscription?.plan || 'basic');

        // Only fetch stats if on pro/enterprise plan
        if (subscription?.plan === 'professional' || subscription?.plan === 'enterprise') {
          // Fetch API keys count
          const { data: apiKeys } = await supabase
            .from('api_keys')
            .select('id, last_used_at')
            .eq('user_id', user.id)
            .eq('is_active', true);

          // Fetch webhooks count
          const { data: webhooks } = await supabase
            .from('webhooks')
            .select('id')
            .eq('user_id', user.id)
            .eq('is_active', true);

          // Find most recently used key
          const lastUsed = apiKeys?.reduce((latest, key) => {
            if (!latest || (key.last_used_at && new Date(key.last_used_at) > new Date(latest))) {
              return key.last_used_at;
            }
            return latest;
          }, null as string | null);

          setStats({
            activeKeys: apiKeys?.length || 0,
            webhooks: webhooks?.length || 0,
            lastKeyUsed: lastUsed
          });
        }
      } catch (error) {
        console.error('Error fetching integration stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isProOrEnterprise = currentPlan === 'professional' || currentPlan === 'enterprise';

  if (!isProOrEnterprise) {
    return (
      <div className="p-4 sm:p-8">
        <div className="bg-white dark:bg-dark-800 rounded-xl p-8 text-center border border-gray-200/50 dark:border-dark-700/50">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Professional Plan Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            API access and webhooks are available on the Professional and Enterprise plans. Upgrade your plan to access these features.
          </p>
          <a
            href="/profile?tab=billing"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Upgrade Plan
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Integration Overview Card */}
      <div className="mb-8 bg-gradient-to-br from-indigo-50 via-white to-indigo-50 dark:from-indigo-900/20 dark:via-dark-800 dark:to-indigo-900/20 rounded-2xl p-6 sm:p-8 border border-indigo-100/50 dark:border-indigo-800/50">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
            <Plug className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Integration Overview</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your API and webhook usage</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 dark:border-dark-700/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active API Keys</span>
              {loading ? (
                <div className="h-4 w-4 border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
              ) : (
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {stats.activeKeys}
                </span>
              )}
            </div>
            <div className="mt-2 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 rounded-full ${
                stats.activeKeys > 0 ? 'w-full' : 'w-0'
              }`}></div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 dark:border-dark-700/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Webhooks</span>
              {loading ? (
                <div className="h-4 w-4 border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
              ) : (
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {stats.webhooks}
                </span>
              )}
            </div>
            <div className="mt-2 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 rounded-full ${
                stats.webhooks > 0 ? 'w-full' : 'w-0'
              }`}></div>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 dark:border-dark-700/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last API Usage</span>
              {loading ? (
                <div className="h-4 w-4 border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
              ) : (
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {stats.lastKeyUsed ? new Date(stats.lastKeyUsed).toLocaleDateString() : 'Never'}
                </span>
              )}
            </div>
            <div className="mt-2 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 rounded-full ${
                stats.lastKeyUsed ? 'w-full' : 'w-0'
              }`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* API Keys Card */}
        <a
          href="/settings/api-keys"
          className="group bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">API Keys</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your API access tokens</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400">
              {loading ? 'Loading...' : `${stats.activeKeys} Active Keys`}
            </span>
          </div>
        </a>

        {/* Webhooks Card */}
        <a
          href="/settings/webhooks"
          className="group bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200/50 dark:border-dark-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Webhook className="h-5 w-5 text-pink-600 dark:text-pink-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Webhooks</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configure event notifications</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-400">
              {loading ? 'Loading...' : `${stats.webhooks} Active Webhooks`}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default APISection;