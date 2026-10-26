
import React from 'react';

const LocationSearchPanel = ({
    suggestions = [],
    setPanelOpen,
    setPickup,
    setDestination,
    activeField,
    onSuggestionSelect
}) => {
    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion.description);
        } else if (activeField === 'destination') {
            setDestination(suggestion.description);
        }

        if (onSuggestionSelect) {
            onSuggestionSelect();
        }

        setPanelOpen(false);
    };

    return (
        <div className="bg-white w-full">
            {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                    <div
                        key={`${suggestion.lat}-${suggestion.lng}-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center gap-4 p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 active:border-black"
                    >
                        <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                            <i className="ri-map-pin-line text-xl"></i>
                        </div>

                        <h4 className="font-medium text-gray-800 text-sm">
                            {suggestion.description}
                        </h4>
                    </div>
                ))
            ) : (
                <p className="p-4 text-sm text-gray-500">
                    Type a location to see suggestions.
                </p>
            )}
        </div>
    );
};

export default LocationSearchPanel;
