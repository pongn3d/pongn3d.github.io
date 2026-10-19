const page = document.querySelector<HTMLElement>('.work-page');
if (page) {
  const viewButtons = [...page.querySelectorAll<HTMLButtonElement>('[data-view-control]')];
  const views = [...page.querySelectorAll<HTMLElement>('[data-work-view]')];
  const categoryFilter = page.querySelector<HTMLSelectElement>('[data-category-filter]');
  const tagFilters = [...page.querySelectorAll<HTMLInputElement>('[data-tag-filter]')];
  const clearButton = page.querySelector<HTMLButtonElement>('[data-clear-filters]');
  const resultCount = page.querySelector<HTMLElement>('[data-result-count]');
  const emptyState = page.querySelector<HTMLElement>('[data-empty-state]');
  const items = [...page.querySelectorAll<HTMLElement>('[data-project-item]')];

  const setView = (view: string, updateUrl: boolean) => {
    const selected = view === 'archive' ? 'archive' : 'grid';
    for (const button of viewButtons) button.setAttribute('aria-pressed', String(button.dataset.viewControl === selected));
    for (const section of views) section.hidden = section.dataset.workView !== selected;
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (selected === 'archive') url.searchParams.set('view', 'archive');
      else url.searchParams.delete('view');
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
  };

  const applyFilters = () => {
    const selectedCategory = categoryFilter?.value ?? '';
    const selectedTags = tagFilters.filter((input) => input.checked).map((input) => input.value);
    const visibleProjectSlugs = new Set<string>();
    for (const item of items) {
      const categoryMatches = !selectedCategory || item.dataset.category === selectedCategory;
      const itemTags = (item.dataset.tags ?? '').split('|').filter(Boolean);
      const tagsMatch = selectedTags.length === 0 || selectedTags.some((tag) => itemTags.includes(tag));
      const matches = categoryMatches && tagsMatch;
      item.hidden = !matches;
      if (matches && item.dataset.projectSlug) visibleProjectSlugs.add(item.dataset.projectSlug);
    }
    const visible = visibleProjectSlugs.size;
    if (resultCount) {
      const prefix = resultCount.dataset.prefix ?? '';
      const unit = visible === 1 ? resultCount.dataset.singular : resultCount.dataset.plural;
      resultCount.textContent = `${prefix} ${visible} ${unit ?? ''}`.trim();
    }
    if (emptyState) emptyState.hidden = visible > 0;
  };

  for (const button of viewButtons) button.addEventListener('click', () => setView(button.dataset.viewControl ?? 'grid', true));
  categoryFilter?.addEventListener('change', applyFilters);
  for (const input of tagFilters) input.addEventListener('change', applyFilters);
  clearButton?.addEventListener('click', () => {
    if (categoryFilter) categoryFilter.value = '';
    for (const input of tagFilters) input.checked = false;
    applyFilters();
  });

  const initialView = new URLSearchParams(window.location.search).get('view') === 'archive' ? 'archive' : 'grid';
  setView(initialView, false);
  applyFilters();
}
