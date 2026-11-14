import { useId, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { ComboboxOption, ComboboxProps } from "../types/sharedType";
import { normalizeSearch } from "../utils/normalizeSearch";

export function Combobox<T extends ComboboxOption>({
  id,
  options,
  value,
  onChange,
  onBlur,
  getMeta,
  placeholder,
  emptyMessage,
}: ComboboxProps<T>) {
  // ------------- State -------------
  const listId = useId();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // ------------- Set selected / filtered options -------------
  const selected = options.find((option) => option.id === value);
  const filtered = options.filter((option) =>
    normalizeSearch(option.name).includes(normalizeSearch(query)),
  );

  const activeOption = filtered[activeIndex];

  const inputValue = isOpen ? query : (selected?.name ?? "");

  // ------------- Actions -------------
  const open = () => {
    setIsOpen(true);
    setQuery("");
    setActiveIndex(0);
  };

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  const select = (item: T) => {
    onChange(item.id);
    close();
  };

  // ------------- Handle change -------------
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
    setActiveIndex(0);
  };
  // ------------- Handle key down -------------
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          open();
        } else {
          setActiveIndex((current) =>
            Math.min(current + 1, filtered.length - 1),
          );
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
        break;

      case "Enter":
        if (isOpen) {
          event.preventDefault();
          if (activeOption) select(activeOption);
        }
        break;

      case "Escape":
        if (isOpen) {
          event.stopPropagation();
          close();
        }
        break;
    }
  };
  // ------------- Handle blur -------------
  const handleBlur = () => {
    close();
    onBlur?.();
  };

  // ------------- Render -------------
  return (
    <div className="combobox">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          isOpen && activeOption ? `${listId}-${activeOption.id}` : undefined
        }
        autoComplete="off"
        className="input"
        placeholder={
          isOpen && selected
            ? selected.name
            : placeholder
              ? placeholder
              : "Nenhum item selecionado"
        }
        value={inputValue}
        onFocus={open}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />

      {isOpen &&
        (filtered.length === 0 ? (
          <p className="combobox__list combobox__empty">
            {emptyMessage ? emptyMessage : "Nenhum item encontrado"}
          </p>
        ) : (
          <ul id={listId} role="listbox" className="combobox__list">
            {filtered.map((item, index) => (
              <li
                key={item.id}
                id={`${listId}-${item.id}`}
                role="option"
                aria-selected={item.id === value}
                className={
                  index === activeIndex
                    ? "combobox__option combobox__option--active"
                    : "combobox__option"
                }
                ref={(element) => {
                  if (index === activeIndex) {
                    element?.scrollIntoView({ block: "nearest" });
                  }
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  select(item);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span>{item.name}</span>
                {getMeta && (
                  <span className="combobox__meta">{getMeta(item)}</span>
                )}
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
