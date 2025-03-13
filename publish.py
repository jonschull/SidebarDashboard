#!/usr/bin/env python3
"""
publish.py - Module for handling dashboard publishing functionality

This module:
1. Provides functions to publish dashboards to GitHub Pages
2. Executes the publish_dashboard.sh script with appropriate parameters
3. Returns the output from the publishing process
4. Can be imported into simple_server.py to handle /publish/ requests

Usage:
    from publish import publish_dashboard
    result = publish_dashboard("dashboard_name")
"""

import os
import subprocess
import re

def publish_dashboard(dashboard_name, force=True):
    """
    Publish a dashboard to GitHub Pages by executing the publish_dashboard.sh script.
    
    Args:
        dashboard_name (str): Name of the dashboard to publish
        force (bool): If True, automatically answer 'y' to any prompts (default: True)
        
    Returns:
        Dict containing:
            - success (bool): Whether the publishing was successful
            - output (str): Combined stdout and stderr from the publish script
            - error (str): Error message if an exception occurred, empty otherwise
            - githubPagesUrl (str): URL to the published dashboard on GitHub Pages (if successful)
    """
    if not dashboard_name:
        return {
            "success": False,
            "output": "Error: Dashboard name is required",
            "error": "Missing dashboard name"
        }
    
    try:
        # Get the root directory of the project
        root_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Execute the publish script
        process = subprocess.Popen(
            ['./publish_dashboard.sh', dashboard_name],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            cwd=root_dir,
            universal_newlines=True
        )
        
        # Send 'y' to any prompts if force is True
        stdout, _ = process.communicate(input='y\n' if force else None)
        
        # Check if the process was successful
        success = process.returncode == 0
        
        # Filter out git-related messages to create a cleaner output
        filtered_output = []
        github_pages_url = None
        
        for line in stdout.split('\n'):
            # Skip git-related messages
            if any(git_term in line.lower() for git_term in ['git ', 'github.com', 'commit', 'push', 'branch', 'repository']):
                continue
                
            # Skip warning about uncommitted changes
            if line.startswith("Warning: You have uncommitted changes"):
                continue
                
            # Keep important messages
            if line and not line.startswith('==') and not line.startswith('To '):
                filtered_output.append(line)
                
            # Extract GitHub Pages URL
            if "Dashboard URL:" in line:
                match = re.search(r'(https://[^\s]+)', line)
                if match:
                    github_pages_url = match.group(1)
        
        # Join the filtered output lines
        clean_output = '\n'.join(filtered_output).strip()
        
        # Create a simplified output
        if success:
            simplified_output = f"""Dashboard '{dashboard_name}' published successfully!

Your dashboard is now available at:
{github_pages_url}

Note: It may take a few minutes for changes to appear on GitHub Pages."""
        else:
            # For errors, provide a clean error message without git details
            simplified_output = f"""Failed to publish dashboard '{dashboard_name}'.

Please check that:
1. The dashboard name is correct
2. The server has proper permissions
3. Your internet connection is working

For technical support, please contact the administrator."""
        
        result = {
            "success": success,
            "output": simplified_output
        }
        
        # Add GitHub Pages URL if available
        if github_pages_url:
            result["githubPagesUrl"] = github_pages_url
            
        # Add error message if publish failed
        if not success:
            result["error"] = "Publishing failed"
        
        return result
        
    except Exception as e:
        return {
            "success": False,
            "output": f"Error: {str(e)}",
            "error": str(e)
        }

def get_available_dashboards():
    """
    Get a list of available dashboards that can be published.
    
    Returns:
        Dict containing:
            - success (bool): Whether retrieving the list was successful
            - dashboards (list): List of available dashboard names
            - error (str): Error message if an exception occurred, empty otherwise
    """
    try:
        # Get the root directory of the project
        root_dir = os.path.dirname(os.path.abspath(__file__))
        
        dashboard_content_dir = os.path.join(root_dir, 'dashboard_content')
        
        # Get all subdirectories in dashboard_content
        dashboards = [
            name for name in os.listdir(dashboard_content_dir)
            if os.path.isdir(os.path.join(dashboard_content_dir, name)) and not name.startswith('.')
        ]
        
        return {
            "success": True,
            "dashboards": dashboards,
            "error": ""
        }
        
    except Exception as e:
        return {
            "success": False,
            "dashboards": [],
            "error": str(e)
        }

if __name__ == "__main__":
    # Example usage when run directly
    import sys
    import argparse
    
    # Set up argument parsing
    parser = argparse.ArgumentParser(description='Publish a dashboard to GitHub Pages')
    parser.add_argument('dashboard_name', nargs='?', help='Name of the dashboard to publish')
    parser.add_argument('--force', '-f', action='store_true', help='Automatically answer yes to prompts')
    parser.add_argument('--list', '-l', action='store_true', help='List available dashboards')
    
    args = parser.parse_args()
    
    # If --list flag is provided or no dashboard name, show available dashboards
    if args.list or not args.dashboard_name:
        result = get_available_dashboards()
        if result["success"]:
            print("Available dashboards:")
            for dashboard in result["dashboards"]:
                print(f"  - {dashboard}")
            if not args.dashboard_name:
                print("\nUsage: python publish.py <dashboard_name> [--force]")
                sys.exit(0)
        else:
            print(f"Error: {result['error']}")
            sys.exit(1)
    
    # Publish the specified dashboard
    result = publish_dashboard(args.dashboard_name, force=args.force)
    
    # Print the output
    print(result["output"])
    
    # Exit with appropriate code
    sys.exit(0 if result["success"] else 1)
