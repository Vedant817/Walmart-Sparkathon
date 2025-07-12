
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Loading and parsing the CSV data from file path
def load_and_parse_data(file_path):
    # Reading CSV file from the provided path
    df = pd.read_csv(file_path)
    
    # Extracting month from Order Date
    df['Order Date'] = pd.to_datetime(df['Order Date'])
    df['Month'] = df['Order Date'].dt.month
    
    # Aggregating data to count orders per supplier for each month and category
    agg_data = df.groupby(['Month', 'Category', 'Supplier']).size().reset_index(name='OrderCount')
    
    # Finding the supplier with the maximum order count for each month-category combination
    max_supplier = agg_data.loc[agg_data.groupby(['Month', 'Category'])['OrderCount'].idxmax()]
    
    return max_supplier[['Month', 'Category', 'Supplier']]

# Preparing data for model training
def prepare_data(data):
    # Encoding categorical variables
    le_category = LabelEncoder()
    le_supplier = LabelEncoder()
    
    data['Category_Encoded'] = le_category.fit_transform(data['Category'])
    data['Supplier_Encoded'] = le_supplier.fit_transform(data['Supplier'])
    
    # Features and target
    X = data[['Month', 'Category_Encoded']]
    y = data['Supplier_Encoded']
    
    return X, y, le_category, le_supplier

# Training the Random Forest model
def train_model(X, y):
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    return model

# Predicting the supplier for a given month and category
def predict_supplier(model, le_category, le_supplier, month, category):
    try:
        # Encoding the input category
        category_encoded = le_category.transform([category])[0]
        # Creating input DataFrame
        input_data = pd.DataFrame({'Month': [month], 'Category_Encoded': [category_encoded]})
        # Predicting
        supplier_encoded = model.predict(input_data)[0]
        # Decoding the supplier
        supplier = le_supplier.inverse_transform([supplier_encoded])[0]
        return supplier
    except ValueError:
        # Fallback: Return a message with valid categories if encoding fails
        return f"Unknown category '{category}'. Please use one of: {', '.join(le_category.classes_)}"

# Main function to run the prediction
def main(file_path, month, category):
    # Loading and parsing data
    data = load_and_parse_data(file_path)
    
    # Preparing data for training
    X, y, le_category, le_supplier = prepare_data(data)
    
    # Training the model
    model = train_model(X, y)
    
    # Predicting the supplier
    supplier = predict_supplier(model, le_category, le_supplier, month, category)
    
    return supplier

# Example usage
if __name__ == "__main__":
    # Specify the file path to Store_A.csv
    file_path = "Walmart-Sparkathon/dataset/version-2/orders/Store_A.csv"  # Replace with the actual file path
    # Example: Predicting supplier for Food in July (month 7)
    month = 1
    category = "Food"
    predicted_supplier = main(file_path, month, category)
    print(f"Predicted supplier for {category} in month {month}: {predicted_supplier}")
