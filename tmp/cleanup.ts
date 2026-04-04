import fs from 'fs';
import path from 'path';

const middlewarePath = path.join(process.cwd(), 'middleware.ts');

if (fs.existsSync(middlewarePath)) {
    fs.unlinkSync(middlewarePath);
    console.log('Successfully deleted middleware.ts');
} else {
    console.log('middleware.ts already deleted or not found');
}
