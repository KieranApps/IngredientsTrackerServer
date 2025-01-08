export const UNIT_CONVERSION_MAPPING = {
    // ALL will be multiplied
    'g': { // FROM g TO kg
        'kg': 0.001
    },
    'kg': { // FROM kg TO g
        'g': 1000
    },
    'ml': {
        'L': 0.001
    },
    'L': {
        'ml': 1000
    },
    'tsp': {
        'tbsp': 0.3333333333
    },
    'tbsp': {
        'tsp': 3
    }
};
