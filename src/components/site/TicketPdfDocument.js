
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 28,
    backgroundColor: '#F5EFE5',
    fontFamily: 'Helvetica',
    color: '#2A211A',
  },
  card: {
    padding: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5DFD3',
    borderRadius: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 8,
    color: '#8B6B3F',
    letterSpacing: 1.2,
  },
  reference: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 6,
  },
  status: {
    fontSize: 8,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#D9B98C',
    borderRadius: 12,
  },
  accessBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F6F1',
    borderWidth: 1,
    borderColor: '#E5DFD3',
    borderRadius: 12,
    padding: 13,
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 7,
    color: '#777064',
    marginBottom: 5,
    letterSpacing: 0.8,
  },
  accessCode: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  hint: {
    fontSize: 8,
    color: '#777064',
    marginTop: 5,
  },
  qr: {
    width: 76,
    height: 76,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detail: {
    width: '50%',
    paddingRight: 12,
    paddingBottom: 15,
  },
  label: {
    fontSize: 7,
    color: '#777064',
    marginBottom: 5,
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#25251F',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5DFD3',
    paddingTop: 15,
  },
  infoCard: {
    width: '48%',
    padding: 12,
    backgroundColor: '#F8F6F1',
    borderWidth: 1,
    borderColor: '#E5DFD3',
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 7,
    color: '#777064',
    letterSpacing: 1,
    marginBottom: 9,
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: '#777064',
  },
  link: {
    marginTop: 9,
    fontSize: 8,
    color: '#8B6B3F',
    textDecoration: 'underline',
  },
  url: {
    marginTop: 6,
    fontSize: 6.5,
    color: '#8B6B3F',
    textDecoration: 'underline',
  },
});

export default function TicketPdfDocument({
  booking,
  rows,
  t,
  locationUrl,
}) {
  return (
    <Document
      title={`Visitimlaline Ticket ${booking.booking_reference}`}
      author="Visitimlaline"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>
                {t('ticket.eyebrow')}
              </Text>
              <Text style={styles.reference}>
                {booking.booking_reference}
              </Text>
            </View>

            <Text style={styles.status}>
              {String(booking.status || '').replace(/[_-]+/g, ' ')}
            </Text>
          </View>

          {booking.access_code ? (
            <View style={styles.accessBox}>
              <View>
                <Text style={styles.sectionLabel}>
                  {t('ticket.code')}
                </Text>
                <Text style={styles.accessCode}>
                  {booking.access_code}
                </Text>
                <Text style={styles.hint}>
                  {t('ticket.checkInHint')}
                </Text>
              </View>

              {booking.qr_code ? (
                <Image
                  src={booking.qr_code}
                  style={styles.qr}
                />
              ) : null}
            </View>
          ) : null}

          <View style={styles.details}>
            {rows.map((row, index) => (
              <View
                key={`${row.label}-${index}`}
                style={styles.detail}
              >
                <Text style={styles.label}>
                  {row.label}
                </Text>
                <Text style={styles.value}>
                  {String(row.value ?? '')}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>
                PAYMENT
              </Text>
              <Text style={styles.infoTitle}>
                Payment upon arrival
              </Text>
              <Text style={styles.infoText}>
                Pay at the destination when you arrive.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>
                LOCATION
              </Text>
              <Text style={styles.infoTitle}>
                Timlaline Dunes, Morocco
              </Text>

              <Link
                src={locationUrl}
                style={styles.link}
              >
                Open location on Google Maps
              </Link>

              
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
