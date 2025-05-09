import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  File, 
  Clock, 
  ArrowRight, 
  Car, 
  Banknote, 
  Bookmark, 
  CheckCircle,
  AlertTriangle,
  Tag,
  FileText,
  LayoutGrid,
  CalendarRange,
  X,
  ChevronsUpDown,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

// Sample document data structure
interface DocumentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface DocumentTag {
  id: string;
  name: string;
  color: string;
}

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  category: string;
  icon: React.ReactNode;
  iconBg: string;
  tags: string[];
  vehicle?: string;
  expiryDate?: string;
  issuedDate?: string;
  status?: "valid" | "expiring" | "expired";
}

const categories: DocumentCategory[] = [
  { 
    id: "all", 
    name: "All Documents", 
    icon: <LayoutGrid className="h-4 w-4" />, 
    color: "text-gray-500"
  },
  { 
    id: "registration", 
    name: "Registration", 
    icon: <FileText className="h-4 w-4" />, 
    color: "text-blue-500"
  },
  { 
    id: "insurance", 
    name: "Insurance", 
    icon: <Shield className="h-4 w-4" />, 
    color: "text-green-500"
  },
  { 
    id: "service", 
    name: "Service Records", 
    icon: <Tool className="h-4 w-4" />, 
    color: "text-amber-500"
  },
  { 
    id: "tax", 
    name: "Tax Documents", 
    icon: <Banknote className="h-4 w-4" />, 
    color: "text-purple-500"
  },
  { 
    id: "invoice", 
    name: "Invoices & Receipts", 
    icon: <Receipt className="h-4 w-4" />, 
    color: "text-rose-500"
  }
];

const tags: DocumentTag[] = [
  { id: "important", name: "Important", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  { id: "personal", name: "Personal", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  { id: "shared", name: "Shared", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  { id: "archived", name: "Archived", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" },
];

// Sample documents for search results
const sampleDocuments: DocumentItem[] = [
  {
    id: "doc1",
    title: "Vehicle Registration Certificate",
    type: "RC Book",
    category: "registration",
    icon: <FileText className="h-4 w-4" />,
    iconBg: "bg-blue-100 text-blue-800",
    tags: ["important"],
    vehicle: "BMW X5",
    expiryDate: "2026-05-12",
    issuedDate: "2021-05-12",
    status: "valid"
  },
  {
    id: "doc2",
    title: "Comprehensive Insurance Policy",
    type: "Insurance",
    category: "insurance",
    icon: <Shield className="h-4 w-4" />,
    iconBg: "bg-green-100 text-green-800",
    tags: ["important", "shared"],
    vehicle: "BMW X5",
    expiryDate: "2024-07-23",
    issuedDate: "2023-07-23",
    status: "expiring"
  },
  {
    id: "doc3",
    title: "PUC Certificate",
    type: "Pollution Certificate",
    category: "registration",
    icon: <FileText className="h-4 w-4" />,
    iconBg: "bg-blue-100 text-blue-800",
    tags: ["important"],
    vehicle: "BMW X5",
    expiryDate: "2024-02-15",
    issuedDate: "2023-08-15",
    status: "expired"
  },
  {
    id: "doc4",
    title: "Recent Service Record",
    type: "Service",
    category: "service",
    icon: <Tool className="h-4 w-4" />,
    iconBg: "bg-amber-100 text-amber-800",
    tags: ["personal"],
    vehicle: "BMW X5",
    issuedDate: "2023-10-05"
  },
  {
    id: "doc5",
    title: "Road Tax Receipt",
    type: "Tax",
    category: "tax",
    icon: <Banknote className="h-4 w-4" />,
    iconBg: "bg-purple-100 text-purple-800",
    tags: ["important", "archived"],
    vehicle: "BMW X5",
    issuedDate: "2023-01-15",
    expiryDate: "2024-01-15",
    status: "expired"
  },
  {
    id: "doc6",
    title: "Parts Replacement Invoice",
    type: "Invoice",
    category: "invoice",
    icon: <Receipt className="h-4 w-4" />,
    iconBg: "bg-rose-100 text-rose-800",
    tags: ["archived"],
    vehicle: "BMW X5",
    issuedDate: "2023-09-20"
  }
];

// Recent search terms
const recentSearches = [
  "insurance",
  "registration bmw",
  "tax documents",
  "service history"
];

// Common document searches
const commonSearches = [
  { id: "expiring", label: "Expiring Soon", icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> },
  { id: "renewal", label: "Need Renewal", icon: <RefreshCw className="h-4 w-4 text-blue-500" /> },
  { id: "shared", label: "Shared with Others", icon: <Users className="h-4 w-4 text-green-500" /> },
  { id: "recent", label: "Recently Added", icon: <Clock className="h-4 w-4 text-purple-500" /> }
];

// Function to get status badge
const getStatusBadge = (status?: "valid" | "expiring" | "expired") => {
  if (!status) return null;
  
  switch (status) {
    case "valid":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Valid
        </Badge>
      );
    case "expiring":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <AlertTriangle className="h-3 w-3 mr-1" /> Expiring Soon
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertTriangle className="h-3 w-3 mr-1" /> Expired
        </Badge>
      );
    default:
      return null;
  }
};

import { Tool, Receipt, Users, RefreshCw, Shield } from "lucide-react";

interface SmartDocumentSearchProps {
  className?: string;
  onSelectDocument?: (document: DocumentItem) => void;
}

export function SmartDocumentSearch({ className, onSelectDocument }: SmartDocumentSearchProps) {
  const { t } = useTranslation(['common', 'documents']);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentItem[]>(sampleDocuments);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Function to generate search suggestions based on search term
  useEffect(() => {
    if (!searchTerm) {
      setSearchSuggestions([]);
      return;
    }
    
    // Generate suggestions based on document titles, types, and tags
    const suggestions: string[] = [];
    
    // Add document title and type matches
    sampleDocuments.forEach(doc => {
      if (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !suggestions.includes(doc.title)) {
        suggestions.push(doc.title);
      }
      
      if (doc.type.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !suggestions.includes(doc.type)) {
        suggestions.push(doc.type);
      }
      
      if (doc.vehicle && doc.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !suggestions.includes(doc.vehicle)) {
        suggestions.push(doc.vehicle);
      }
    });
    
    // Add category matches
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !suggestions.includes(category.name)) {
        suggestions.push(category.name);
      }
    });
    
    // Add tag matches
    tags.forEach(tag => {
      if (tag.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !suggestions.includes(tag.name)) {
        suggestions.push(tag.name);
      }
    });
    
    setSearchSuggestions(suggestions.slice(0, 5)); // Limit to 5 suggestions
  }, [searchTerm]);
  
  // Filter documents based on search term and filters
  useEffect(() => {
    let results = [...sampleDocuments];
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(doc => 
        doc.title.toLowerCase().includes(searchLower) ||
        doc.type.toLowerCase().includes(searchLower) ||
        (doc.vehicle && doc.vehicle.toLowerCase().includes(searchLower)) ||
        doc.tags.some(tagId => {
          const tag = tags.find(t => t.id === tagId);
          return tag?.name.toLowerCase().includes(searchLower);
        })
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter(doc => doc.category === selectedCategory);
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      results = results.filter(doc => 
        selectedTags.every(tagId => doc.tags.includes(tagId))
      );
    }
    
    setFilteredDocuments(results);
  }, [searchTerm, selectedCategory, selectedTags]);
  
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [open]);
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };
  
  const handleSearchTermClear = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setTimeout(() => {
        setSearchTerm("");
        setSearchSuggestions([]);
      }, 200);
    }
  };
  
  const handleDocumentSelect = (document: DocumentItem) => {
    if (onSelectDocument) {
      onSelectDocument(document);
    }
    setOpen(false);
  };
  
  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    searchInputRef.current?.focus();
  };

  const handleCommonSearchClick = (searchType: string) => {
    switch (searchType) {
      case "expiring":
        setSearchTerm("");
        setFilteredDocuments(sampleDocuments.filter(doc => doc.status === "expiring"));
        break;
      case "renewal":
        setSearchTerm("");
        setFilteredDocuments(sampleDocuments.filter(doc => doc.status === "expired"));
        break;
      case "shared":
        setSearchTerm("");
        setSelectedTags(["shared"]);
        break;
      case "recent":
        // In a real app, would sort by recent date
        setSearchTerm("");
        setFilteredDocuments([...sampleDocuments].sort((a, b) => {
          if (!a.issuedDate || !b.issuedDate) return 0;
          return new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime();
        }));
        break;
      default:
        break;
    }
    searchInputRef.current?.focus();
  };
  
  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedTags([]);
    setSearchTerm("");
    searchInputRef.current?.focus();
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        className={cn(
          "w-full justify-start text-sm text-muted-foreground font-normal",
          className
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        {t('documents:search.placeholder', 'Search documents...')}
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange} className="max-w-3xl">
        <div className="flex border-b">
          <Search className="mx-2 my-3 h-4 w-4 text-muted-foreground" />
          <input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('documents:search.placeholder', 'Search documents...')}
            className="flex h-10 w-full rounded-md bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 mx-1 my-0.5"
              onClick={handleSearchTermClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Search suggestions */}
        <AnimatePresence>
          {searchSuggestions.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b overflow-hidden"
            >
              <div className="p-2 flex flex-wrap gap-1">
                {searchSuggestions.map((suggestion, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-12 h-[calc(80vh-2.5rem)] overflow-hidden">
          {/* Left sidebar - Categories and Tags */}
          <div className="col-span-3 border-r overflow-y-auto">
            <CommandGroup className="p-2">
              <div className="text-xs font-medium text-muted-foreground p-2">
                {t('documents:search.categories', 'CATEGORIES')}
              </div>
              <ScrollArea className="h-[25vh]">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer",
                      selectedCategory === category.id 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:bg-accent/50"
                    )}
                  >
                    <span className={category.color}>{category.icon}</span>
                    <span>{category.name}</span>
                    {selectedCategory === category.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup className="p-2">
              <div className="text-xs font-medium text-muted-foreground p-2">
                {t('documents:search.tags', 'TAGS')}
              </div>
              <ScrollArea className="h-[20vh]">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer",
                      selectedTags.includes(tag.id) 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:bg-accent/50"
                    )}
                  >
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      tag.color.split(' ')[0] // Get just the background color
                    )} />
                    <span>{tag.name}</span>
                    {selectedTags.includes(tag.id) && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CommandGroup>
            
            <CommandSeparator />
            
            <div className="p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs justify-start"
                onClick={clearFilters}
              >
                <X className="h-3.5 w-3.5 mr-2" />
                {t('documents:search.clearFilters', 'Clear filters')}
              </Button>
            </div>
          </div>
          
          {/* Right content - Search results */}
          <div className="col-span-9 overflow-hidden flex flex-col">
            {/* Common and recent searches */}
            {!searchTerm && selectedCategory === "all" && selectedTags.length === 0 && (
              <>
                <CommandGroup className="p-2 border-b">
                  <div className="text-xs font-medium text-muted-foreground p-2">
                    {t('documents:search.commonSearches', 'COMMON SEARCHES')}
                  </div>
                  <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                    {commonSearches.map((search) => (
                      <div
                        key={search.id}
                        onClick={() => handleCommonSearchClick(search.id)}
                        className="flex items-center gap-2 p-2 text-sm border rounded-md cursor-pointer hover:bg-accent"
                      >
                        {search.icon}
                        <span>{search.label}</span>
                      </div>
                    ))}
                  </div>
                </CommandGroup>
                
                <CommandGroup className="p-2 border-b">
                  <div className="text-xs font-medium text-muted-foreground p-2">
                    {t('documents:search.recentSearches', 'RECENT SEARCHES')}
                  </div>
                  <div className="flex flex-wrap gap-1 px-2 pb-2">
                    {recentSearches.map((term, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="cursor-pointer hover:bg-accent flex items-center"
                        onClick={() => handleRecentSearchClick(term)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {term}
                      </Badge>
                    ))}
                  </div>
                </CommandGroup>
              </>
            )}
            
            {/* Applied filters indicator */}
            {(searchTerm || selectedCategory !== "all" || selectedTags.length > 0) && (
              <div className="flex items-center gap-2 p-2 border-b">
                <div className="text-xs font-medium text-muted-foreground">
                  {t('documents:search.activeFilters', 'ACTIVE FILTERS:')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      {searchTerm}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchTerm("");
                        }}
                      />
                    </Badge>
                  )}
                  
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {categories.find(c => c.id === selectedCategory)?.icon}
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory("all");
                        }}
                      />
                    </Badge>
                  )}
                  
                  {selectedTags.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    return (
                      <Badge 
                        key={tagId} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" />
                        {tag?.name}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTag(tagId);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  
                  {(searchTerm || selectedCategory !== "all" || selectedTags.length > 0) && (
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={clearFilters}
                    >
                      {t('documents:search.clearAll', 'Clear all')}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Document results */}
            <CommandList className="overflow-y-auto py-2">
              <ScrollArea className="h-[calc(80vh-14rem)]">
                {filteredDocuments.length === 0 ? (
                  <CommandEmpty className="py-6 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <File className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      {t('documents:search.noResults', 'No documents found')}
                    </h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                      {t('documents:search.tryDifferent', 'Try a different search or clear filters')}
                    </p>
                    <Button size="sm" onClick={clearFilters}>
                      {t('documents:search.clearFilters', 'Clear filters')}
                    </Button>
                  </CommandEmpty>
                ) : (
                  <div className="px-2 space-y-1">
                    {filteredDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-start gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                        onClick={() => handleDocumentSelect(document)}
                      >
                        <div className={cn(
                          "flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center",
                          document.iconBg
                        )}>
                          {document.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">{document.title}</span>
                            {getStatusBadge(document.status)}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Car className="h-3 w-3 mr-1" /> 
                              {document.vehicle}
                            </span>
                            
                            {document.expiryDate && (
                              <span className="flex items-center">
                                <CalendarRange className="h-3 w-3 mr-1" /> 
                                Expires: {new Date(document.expiryDate).toLocaleDateString()}
                              </span>
                            )}
                            
                            <div className="flex gap-1 mt-1">
                              {document.tags.map(tagId => {
                                const tag = tags.find(t => t.id === tagId);
                                if (!tag) return null;
                                return (
                                  <span
                                    key={tagId}
                                    className={cn(
                                      "px-1.5 py-0.5 rounded-full text-[10px]",
                                      tag.color
                                    )}
                                  >
                                    {tag.name}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-50 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            // This would open a menu with more options
                            console.log('More options for document:', document.id);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CommandList>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}