import * as React from "react";
import { Search, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import type { Category } from "@/types";
import { ProductsService } from "@/services";

interface SearchBarProps extends React.ComponentProps<"input"> {
    onSearch: (query: string, category: number | null) => void;
}

export default function SearchBar({
    className,
    onSearch,
    ...props
}: SearchBarProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");

    const [fetchedCategories, setFetchedCategories] = React.useState<
        Category[] | null
    >(null);

    React.useEffect(() => {
        const fetchCategories = async () => {
            const newCategories = await ProductsService.getCategories();
            setFetchedCategories(newCategories);
        };
        fetchCategories();
    }, []);

    if (fetchedCategories === null) return;

    const categories: { id: null | number; value: string; label: string }[] = [
        { id: null, value: "all", label: "Wszystkie kategorie" },
    ];

    fetchedCategories.reduce((categories, category: Category) => {
        categories.push({
            id: category.CategoryID,
            label: category.CategoryName,
            value: category.CategoryName.toLowerCase(),
        });
        return categories;
    }, categories);

    const getCategoryId = (categoryValue: string) => {
        const category = categories.find((c) => c.value === categoryValue);
        return category ? category.id : null;
    };

    const handleSearchClick = () => {
        const currentCategoryId = getCategoryId(value);
        onSearch(searchQuery, currentCategoryId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (currentValue: string) => {
        setValue(currentValue);
        setOpen(false);

        const newCategoryId = getCategoryId(currentValue);
        onSearch(searchQuery, newCategoryId);
    };

    return (
        <div
            className={cn(
                "flex h-10 w-full items-center rounded-md border border-input bg-background pl-3 text-sm ring-offset-background",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                className
            )}
        >
            <Search
                onClick={handleSearchClick}
                className="h-4 w-4 text-muted-foreground mr-2 cursor-pointer hover:text-foreground transition-colors"
            />
            <input
                {...props}
                type="text"
                placeholder="Szukaj..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="h-6 w-px bg-border mx-2" />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        className="h-8 justify-between hover:bg-transparent px-2 text-muted-foreground hover:text-foreground font-normal"
                    >
                        {value
                            ? categories.find((cat) => cat.value === value)
                                  ?.label
                            : "Category"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-50 p-0" align="end">
                    <Command>
                        <CommandInput placeholder="Szukaj kategorii..." />
                        <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                                {categories.map((category) => (
                                    <CommandItem
                                        key={category.value}
                                        value={category.value}
                                        onSelect={handleCategoryChange}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === category.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {category.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
