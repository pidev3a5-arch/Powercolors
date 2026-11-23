import React, { useState, useMemo } from 'react';
import { Terminal, FolderArchive, BookOpen } from 'lucide-react';
import { AppPage } from '../core/types';
import { DaxCategory, DaxTemplate } from '../core/daxToolkit/types';
import { DAX_CATALOG } from '../core/daxToolkit/catalog';
import { DaxSearchBar } from '../components/daxToolkit/DaxSearchBar';
import { DaxTemplateCard } from '../components/daxToolkit/DaxTemplateCard';
import { DaxDetailModal } from '../components/daxToolkit/DaxDetailModal';
import { interpolateDax } from '../core/daxToolkit/daxEngine';

interface DaxToolkitPageProps {
  onNavigate: (page: AppPage) => void;
}

export const DaxToolkitPage: React.FC<DaxToolkitPageProps> = ({
  onNavigate: _onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DaxCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [activeTemplate, setActiveTemplate] = useState<DaxTemplate | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return DAX_CATALOG.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && item.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesDax = item.templateDax.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesDax && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Download all measures in current filtered view as a consolidated .dax file
  const handleExportAllFiltered = () => {
    if (filteredTemplates.length === 0) return;

    let fullFile = `// =========================================================================\n`;
    fullFile += `// PowerLab DAX Toolkit Bundle (${filteredTemplates.length} Measures)\n`;
    fullFile += `// Generated: ${new Date().toISOString()}\n`;
    fullFile += `// =========================================================================\n\n`;

    filteredTemplates.forEach((t) => {
      const code = interpolateDax(t, {});
      fullFile += `// -------------------------------------------------------------------------\n`;
      fullFile += `// Measure: ${t.name} [${t.category}] (${t.difficulty})\n`;
      fullFile += `// ${t.description}\n`;
      fullFile += `// -------------------------------------------------------------------------\n`;
      fullFile += `${code}\n\n`;
    });

    const blob = new Blob([fullFile], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `powerlab_${selectedCategory}_measures.dax`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Downloaded bundle with ${filteredTemplates.length} DAX measures!`);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 min-w-0">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl border-2 border-[#1E293B] bg-[#FBBF24] text-[#1E293B] font-heading font-black text-xs shadow-[3px_3px_0px_0px_#1E293B] animate-in fade-in slide-in-from-bottom-2">
          {notification}
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 min-w-0">
        <div className="space-y-1.5 max-w-xl min-w-0 w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-heading font-black bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-purple-300 border border-[#8B5CF6]/30 shadow-[1.5px_1.5px_0px_0px_#1E293B] max-w-full">
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Power BI Production Calculations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-[#1E293B] dark:text-white tracking-tight break-words">
            DAX Measure Toolkit
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
            A curated library of battle-tested DAX calculation templates for Time Intelligence, Pareto rankings, dynamic titles, KPI variances, and metric switchers. Customize table placeholders dynamically with instant one-click copy and export.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleExportAllFiltered}
            className="w-full sm:w-auto pop-btn inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-heading font-black bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E293B] border-2 border-[#1E293B] shadow-[2.5px_2.5px_0px_0px_#1E293B] cursor-pointer"
            title="Download all currently visible measures in one consolidated .dax file"
          >
            <FolderArchive className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span>Export Bundle ({filteredTemplates.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B] min-w-0">
        <DaxSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          totalResults={filteredTemplates.length}
        />
      </div>

      {/* Templates Card Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 min-w-0">
          {filteredTemplates.map((template) => (
            <DaxTemplateCard
              key={template.id}
              template={template}
              onOpenDetail={setActiveTemplate}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-[#1E293B] bg-white dark:bg-slate-900 shadow-[3px_3px_0px_0px_#1E293B] space-y-3 min-w-0">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-heading font-black text-[#1E293B] dark:text-white">
            No matching DAX templates found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting "All Categories" to view all available formulas.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="pop-btn px-4 py-2 rounded-xl text-xs font-heading font-black bg-[#8B5CF6] text-white border border-[#1E293B] shadow-[2px_2px_0px_0px_#1E293B] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <DaxDetailModal
        template={activeTemplate}
        onClose={() => setActiveTemplate(null)}
      />
    </div>
  );
};
