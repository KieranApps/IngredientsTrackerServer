export const UNIT_CONVERSION_MAPPING = {
    // ALL will be multiplied
    'g': { // FROM kg TO g
        'kg': 1000
    },
    'kg': { // FROM g TO kg
        'g': 0.001
    },
    'ml': {
        'L': 1000
    },
    'L': {
        'ml': 0.001
    },
    'tsp': {
        'tbsp': 3
    },
    'tbsp': {
        'tsp': 0.3333333333
    }
};
