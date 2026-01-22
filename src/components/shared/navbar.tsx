"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import TransitionLink from "./transition-link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import NavbarDropdown from "./navbar-dropdown";
import { ScrollArea } from "../ui/scroll-area";
import { useBrandStore } from "@/store/useBrandStore";
import ButtonNavs from "./bottom-navs";
import NavbarSheet from "./navbar-sheet";
import { useSearch } from "@/hooks/use-search";
import { useModal } from "@/hooks/use-modal";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

export default function Navbar() {
  const [state, setState] = useState(false);
  const params = useParams();
  const [drapdownState, setDrapdownState] = useState<{ isActive: boolean; idx: number | null; }>({ isActive: false, idx: null });
  const [logo, setLogo] = useState("/logos/main-logo.png");
  const pathname = usePathname();
  const modalRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<(HTMLLIElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { brands, fetchBrands, getBrandBySlug, productBrandLogoUrl } = useBrandStore();
  const isVisible = useScrollVisibility({ threshold: 50, hideThreshold: 100 });

  const {
    searchQuery,
    searchResults,
    isSearching,
    handleSearchChange,
    navigateToResults,
    clearSearch,
  } = useSearch({ debounceMs: 300, limit: 5 });

  const {
    isOpen: showSearchModal,
    open: openSearchModal,
    close: closeSearchModal,
    modalRef: searchModalRef,
  } = useModal({
    closeOnEscape: true,
    closeOnOutsideClick: true,
    preventBodyScroll: true,
    onOpen: () => {
      requestAnimationFrame(() => {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      });
    },
    onClose: clearSearch,
  });

  const isBrandProductPage = pathname.startsWith('/brand/') && !pathname.includes('/forward');
  const showHeader = pathname.startsWith("/brand/") || pathname.startsWith("/products/");
  const navigation = [
    {
      title: "Home",
      path: "/",
      isDrapdown: false,
      highlight: pathname === "/",
    },
    {
      title: "Brands",
      path: "/brand",
      isDrapdown: true,
      highlight: pathname.startsWith("/brand") && !isBrandProductPage,
    },
    {
      title: pathname.includes("/brand/") && !pathname.includes('/forward') ? "Products" : "All Products",
      path: pathname.includes("/brand/") && !pathname.includes('/forward') ? `/brand/${params?.slug}/products` : "/products",
      isDrapdown: false,
      highlight: pathname.includes("/products"),
    },
    ...([
      {
        title: "Career",
        path: "/career",
        isDrapdown: false,
        highlight: pathname.includes("/career"),
      },
      {
        title: "About",
        path: "/about",
        isDrapdown: false,
        highlight: pathname.includes("/about"),
      },
      {
        title: "Blogs",
        path: "/blogs",
        isDrapdown: false,
        highlight: pathname.includes("/blogs"),
      },
    ]),
    {
      title: "Contact",
      path: "/contact",
      isDrapdown: false,
      highlight: pathname === "/contact",
    },
  ];

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const target = e.target as Node;
      const isInsideBrand = brandRef.current.some(
        (ref) => ref && ref.contains(target)
      );
      const isInsideModal = modalRef.current?.contains(target);
      if (!isInsideBrand && !isInsideModal) {
        setDrapdownState({ isActive: false, idx: null });
      }
    }
    document.addEventListener("mouseover", handleMouseMove);
    return () => document.removeEventListener("mouseover", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeSearchModal();
    navigateToResults();
  };

  const handleViewAll = () => {
    closeSearchModal();
    navigateToResults();
  };

  // Fetch brands on mount if not already loaded
  useEffect(() => {
    if (brands.length === 0) {
      fetchBrands();
    }
  }, [brands.length, fetchBrands]);

  // Update logo based on pathname and brand data
  useEffect(() => {
    // First priority: product brand logo from store (set by product detail page)
    if (productBrandLogoUrl) {
      setLogo(productBrandLogoUrl);
    } else if (pathname.startsWith("/brand/")) {
      const slug = pathname.split("/")[2];
      const brand = getBrandBySlug(slug);

      if (brand?.logoUrl) {
        setLogo(brand.logoUrl);
      } else {
        setLogo(`/brands/${slug}.png`);
      }
    } else {
      setLogo("/logos/main-logo.png");
    }
  }, [pathname, brands, getBrandBySlug, productBrandLogoUrl]);

  if (pathname.startsWith("/test")) return null

  return (
    <>
      <NavbarDropdown pathname={pathname} drapdownState={drapdownState} setDrapdownState={setDrapdownState} modalRef={modalRef} />
      {showHeader && (
        <div className="py-2 bg-muted/80 flex justify-center items-center relative z-220">
          <TransitionLink href="/">
            <Image src={"/logos/main-logo.png"} height={200} width={200} className="h-8 sm:h-10 w-auto object-contain" alt="plaza sales" />
          </TransitionLink>
        </div>
      )}
      <nav
        className={`sticky  pointer-events-none transition-all duration-500 ${drapdownState.isActive ? "bg-background" : "bg-background backdrop-blur-3xl "} top-0 left-0 z-[220] w-full md:text-sm border-b border-primary/10  ${state ? "shadow-lg rounded-b-xl md:shadow-none" : ""} ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="items-center justify-between lg:py-1 gap-x-4 lg:gap-x-8 xl:gap-x-14 px-4  xl:px-0 lg:max-w-7xl mx-auto lg:flex">



          <div className="flex items-center justify-between w-full  lg:w-auto py-2">
            <div className="pointer-events-auto flex justify-center items-center lg:hidden">
              <NavbarSheet onOpen={openSearchModal} />
            </div>
            <TransitionLink href="/" className="pointer-events-auto  w-fit  flex justify-center items-center ">

              <Image
                src={logo}
                width={170}
                height={100}
                alt="Plaza sales"
                className="h-8 sm:h-10 w-auto  dark:invert-50 object-contain object-center lg:object-left"
              />
            </TransitionLink>


            <div className="lg:hidden z-40  flex justify-center items-center pointer-events-auto">
              {showSearchModal ?
                (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeSearchModal();
                    }}
                    className="text-zinc-400  hover:text-red-500 dark:hover:text-red-500 md:p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                  >
                    <Icon icon="heroicons:x-mark-solid" className="size-6" />
                  </button>
                ) :
                (<button
                  onClick={(e) => {
                    e.stopPropagation();
                    openSearchModal();
                  }}
                  className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 md:p-2 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Icon icon="teenyicons:search-outline" className="size-5" />
                </button>)
              }
            </div>


          </div>

          <div className={`nav-menu flex-1 w-full max-w-2xl pb-3 mt-4 lg:block md:pb-0 md:mt-0 ${state ? "block" : "hidden"}`}>
            <ul className="items-center justify-center space-y-4 lg:flex lg:space-x-5 lg:space-y-0">
              {navigation.map((item, idx) => (
                <li
                  key={idx}
                  ref={(el) => { brandRef.current[idx] = el; }}
                  className="relative pointer-events-auto "
                  onMouseEnter={() => {
                    if (item.isDrapdown) {
                      setDrapdownState({ idx, isActive: true });
                    } else {
                      setDrapdownState({ isActive: false, idx: null });
                    }
                  }}
                  onClick={() => {
                    if (!item.isDrapdown) {
                      setState(false);
                    }
                  }}
                >
                  {item.isDrapdown ? (
                    <TransitionLink href={item?.path}>
                      <button
                        key={idx}
                        className={`w-full flex items-center justify-between md:justify-center gap-1 text-sm  py-2 md:py-0 ${item.highlight ? "text-primary" : ""}`}
                        onClick={(e) => {
                          setDrapdownState({
                            idx,
                            isActive: !(drapdownState.idx === idx && drapdownState.isActive)
                          });
                        }}
                      >
                        {item.title}
                        <Icon icon="famicons:chevron-up" className={`w-5 h-5 transition-all duration-300 ${drapdownState.idx === idx && drapdownState.isActive ? "" : "rotate-180"}`} />
                      </button>
                    </TransitionLink>
                  ) : (
                    <TransitionLink
                      href={item.path}
                      className={`block hover:text-primary text-sm  py-2 md:py-0 ${item.highlight ? "text-primary" : ""}`}
                    >
                      {item.title}
                    </TransitionLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex pointer-events-auto items-center gap-3 lg:gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openSearchModal();
              }}
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 md:p-2 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Icon icon="teenyicons:search-outline" className="size-4" />
            </button>

            <TransitionLink target="_blank" href={"https://wa.me/9779801016633"}>
              <div className="flex gap-2 items-center group text-zinc-500 border rounded-full px-4 py-1.5  hover:text-white transition-all cursor-pointer hover:bg-gradient-to-r from-green-600 to-green-800">
                <Icon icon={"logos:whatsapp-icon"} className="size-4  group-hover:grayscale-0" />
                Whatsapp
              </div>
            </TransitionLink>
          </div>
        </div>
      </nav>
      {state && (
        <div
          onMouseEnter={() => setDrapdownState({ idx: null, isActive: false })}
          className="z-50 md:z-[200] fixed top-0 w-screen h-screen bg-black/20 backdrop-blur-sm md:hidden"
        ></div>
      )}

      {showSearchModal && (
        <div
          className="search-modal-overlay md:fixed inset-0 z-[400] bg-black/60 md:backdrop-blur-sm flex items-start justify-center md:pt-24"
          style={{ contain: 'layout style paint', animation: 'fadeIn 0.15s ease-out' }}
          onClick={(e) => {
            // Only close if clicking directly on overlay, not on modal content
            if (e.target === e.currentTarget) {
              closeSearchModal();
            }
          }}
        >
          <div
            ref={searchModalRef}
            className="search-modal-content bg-white dark:bg-zinc-900 md:rounded-xl text-sm shadow-2xl w-full md:w-[95%] max-w-3xl h-full md:h-auto md:max-h-[70vh] overflow-hidden"
            style={{ contain: 'layout style paint', willChange: 'transform', animation: 'slideUp 0.2s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className=" border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex p-4 items-center gap-3">
                <Icon icon="teenyicons:search-outline" className="size-5 md:size-6 text-zinc-400 shrink-0" />
                <form onSubmit={handleSubmit} className="flex-1">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    maxLength={50}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    className="w-full text-lg md:text-xl bg-transparent border-none outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    autoComplete="off"
                    inputMode="search"
                    enterKeyHint="search"
                  />
                </form>

                <button
                  onClick={closeSearchModal}
                  className="text-zinc-400 hidden md:block hover:text-red-500 dark:hover:text-red-500 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                >
                  <Icon icon="heroicons:x-mark-solid" className="w-6 h-6" />
                </button>

              </div>

            </div>

            {/* Search Results */}
            <ScrollArea className="h-[calc(100vh-70px)] md:h-[calc(70vh-70px)]" style={{ contain: 'layout style paint', touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
              {isSearching ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
                  <Icon icon="line-md:loading-twotone-loop" className="size-5" />
                  <span>Searching...</span>
                </div>
              ) : searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {searchResults.slice(0, 3).map((product) => (
                      <TransitionLink
                        key={product.id}
                        href={`/products/${product?.brand?.slug}/${product?.category?.slug}/${product?.subcategory?.slug}/${product?.slug}`}
                        onClick={closeSearchModal}
                        className="flex items-center gap-4 p-4 md:p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                      >
                        {product.coverImage ? (
                          <Image
                            src={product.coverImage}
                            alt={product.title || "Product"}
                            width={80}
                            height={80}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center shrink-0">
                            <Icon icon="mdi:package-variant" className="size-8 text-zinc-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className=" text-base  font-semibold truncate group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate mt-1">
                            {product?.brandName || product?.model}
                          </p>
                        </div>
                        <Icon icon="tabler:arrow-up-right" className="size-5 text-zinc-400 group-hover:text-primary transition-colors shrink-0" />
                      </TransitionLink>
                    ))}

                    {/* View All Button */}
                    {
                      searchResults.length > 3 && (
                        <div className="p-4 bg-white flex justify-end items-center dark:bg-zinc-800/50 sticky bottom-0">
                          <button
                            onClick={handleViewAll}
                            className="w-fit p-2 px-4 text-center border border-primary text-primary rounded-lg hover:bg-primary hover:text-white font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            View All Results
                            <Icon icon="tabler:arrow-right" className="size-5" />
                          </button>
                        </div>
                      )
                    }
                  </div>
                ) : (
                  <div className="p-12 md:p-16 text-center">
                    <Icon icon="mdi:magnify-close" className="size-16 md:size-20 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" />
                    <p className="text-lg text-zinc-500 dark:text-zinc-400">No products found</p>
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">Try searching with different keywords</p>
                  </div>
                )
              ) : (
                <div className="p-4  ">
                  <p className="text-lg text-zinc-500 dark:text-zinc-400">Quick Search </p>
                  <div className="flex gap-1  mt-2 items-center flex-wrap">
                    {brands?.map((brand) => {
                      if (brand?.name.toLowerCase().includes("forward")) return null;
                      return (
                        <TransitionLink key={brand?.id} onClick={closeSearchModal} href={`/brand/${brand?.slug}/products`} className="bg-muted/80 hover:text-white text-zinc-500 hover:bg-primary px-4 py-1 flex gap-1 items-center rounded-sm">{brand?.name} </TransitionLink>
                      )
                    })}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}

      <ButtonNavs />

    </>
  );
}
