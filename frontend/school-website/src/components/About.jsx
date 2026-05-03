import React, { useState } from 'react';
import { marked } from 'marked';
import { useTenant } from '../context/TenantContext';

const About = () => {
  const { tenant, leadership } = useTenant();
  const [expandedMsg, setExpandedMsg] = useState(null);
  if (!tenant) return null;

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('embed/')) return url;
    if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  const videoUrl = getEmbedUrl(tenant.videoUrl);

  return (
    <>
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: tenant.accentColor }}>
              WHO WE ARE
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">About Our School</h2>
            <div className="w-20 h-1 mx-auto" style={{ backgroundColor: tenant.accentColor }}></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <div
                className="prose prose-lg prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: marked(tenant.aboutText || 'No description available.') }}
              />
            </div>

            <div className="lg:col-span-3 relative">
              {videoUrl ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={videoUrl}
                    title={`${tenant.schoolName} Video`}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : tenant.aboutImageUrl ? (
                <img src={tenant.aboutImageUrl} alt={`About ${tenant.schoolName}`}
                  className="rounded-2xl w-full h-[28rem] object-cover shadow-2xl" />
              ) : (
                <div className="rounded-2xl w-full h-[28rem] flex items-center justify-center shadow-2xl"
                  style={{ backgroundColor: tenant.primaryColor + '15' }}>
                  <span className="text-gray-400">School Image</span>
                </div>
              )}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-lg opacity-20 -z-10"
                style={{ backgroundColor: tenant.accentColor }}></div>
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-lg opacity-20 -z-10"
                style={{ backgroundColor: tenant.primaryColor }}></div>
            </div>
          </div>
        </div>
      </section>

      {leadership && leadership.length > 0 ? (
        <section id="messages" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: tenant.accentColor }}>
                FROM OUR LEADERSHIP
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Messages</h2>
              <div className="w-20 h-1 mx-auto" style={{ backgroundColor: tenant.accentColor }}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {leadership.map((msg, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} alt={msg.name} className="w-full object-cover" />
                  )}
                  <div className="p-8">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: tenant.accentColor }}>
                      {msg.title}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{msg.name}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {expandedMsg === idx ? msg.content : msg.content?.substring(0, 200) + (msg.content?.length > 200 ? '...' : '')}
                    </p>
                    {msg.content?.length > 200 && (
                      <button onClick={() => setExpandedMsg(expandedMsg === idx ? null : idx)}
                        className="mt-4 flex items-center gap-1 font-medium text-sm transition hover:opacity-80"
                        style={{ color: tenant.primaryColor }}>
                        {expandedMsg === idx ? 'Show Less ↑' : 'View Full Message →'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default About;
