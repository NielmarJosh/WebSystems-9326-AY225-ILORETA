"""
Xbox Game Pass Live Scraper - Flask Application
Allows users to enter any Xbox URL and scrape game data live
"""

from flask import Flask, render_template, request, jsonify
from scraper import XboxGamePassLiveScraper
import json
import os

app = Flask(__name__)

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    """
    Endpoint to scrape games from provided URL
    Expects JSON with 'url' field
    """
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({
                'success': False,
                'message': 'Please enter a URL'
            })
        
        # Validate URL
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        # Create scraper instance with the provided URL
        scraper = XboxGamePassLiveScraper(url)
        
        # Perform scraping
        result = scraper.scrape()
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

@app.route('/save', methods=['POST'])
def save_data():
    """Save scraped data to JSON file"""
    try:
        data = request.get_json()
        games = data.get('games', [])
        url = data.get('url', 'unknown')
        
        if not games:
            return jsonify({
                'success': False,
                'message': 'No data to save'
            })
        
        # Prepare data with metadata
        output_data = {
            'scrape_info': {
                'timestamp': data.get('timestamp'),
                'total_games': len(games),
                'source_url': url,
                'stats': data.get('stats', {})
            },
            'games': games
        }
        
        # Save to data.json
        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        return jsonify({
            'success': True,
            'message': f'Data saved to data.json ({len(games)} games)'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error saving data: {str(e)}'
        })

@app.route('/load', methods=['GET'])
def load_data():
    """Load previously saved data"""
    try:
        if os.path.exists('data.json'):
            with open('data.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify({
                'success': True,
                'data': data
            })
        else:
            return jsonify({
                'success': False,
                'message': 'No saved data found'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error loading data: {str(e)}'
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
